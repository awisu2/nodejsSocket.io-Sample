require("./js/common.js");
require("./js/config.js");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// default
app.get('/', function(req, res){
  res.sendfile('html/index.html');
});

// javascriptを返却
var js = express.Router();
js.get('/:f', function(req, res){
  var file = 'js/' + req.params.f;
  res.sendfile(file);
});

// htmlを返却
var html = express.Router();
html.get('/:f', function(req, res){
  var file = 'html/' + req.params.f + ".html";
  res.sendfile(file);
});

// call/xxxでアクセスすると、socketに対してメッセージを送る 
html.get('/call/:method', function(req, res){
  if(!checkAppId(req.query.appid)) {
    res.send("ng");
    return;
  }

  var msg = req.query.msg;
  if(!msg) {
    res.send("ng");
    return;
  }

  // 個別のメソッド
  switch (req.params.method){
    case "send":
      io.emit(SOCKETEVENT.TOCLIENT, msg);
      break;
    case "sendAll":
      io.emit(SOCKETEVENT.TOCLIENT, msg);
      break;
    case "sendRoom":
      var roomid = req.query.roomid;
      if(!roomid) {
        res.send("ng");
      }
      io.to(roomid).emit(SOCKETEVENT.TOCLIENT, msg);
      break;
  }
  var file = 'html/' + req.params.f + ".html";
  res.send("ok");
});

// ルータをセット
app.use(html);
app.use("/js", js);

// socket event
rooms = {};
io.on('connection', function(socket){
  var id = socket.id;
  var idstr = "[" + id + "] ";
  console.log('connection : id = ' + id);

  // イベントの登録
  socket.on('disconnect', function(){
    console.log(idstr + 'disconnect');
  });

  // カスタムイベントの登録
  socket.on(SOCKETEVENT.MESSAGE, function(msg){
    console.log("[" + this.id + "] " + 'message : ' + msg);
    this.emit(SOCKETEVENT.TOCLIENT, msg);
  });
  socket.on(SOCKETEVENT.MESSAGEALL, function(msg){
    console.log("[" + this.id + "] " + 'messageall : ' + msg);
    io.emit(SOCKETEVENT.TOCLIENT, msg);
  });
  socket.on(SOCKETEVENT.JOINROOM, function(roomid){
    console.log("[" + this.id + "] " + 'joinroom : ' + roomid);
    this.join(roomid);
    this.emit(SOCKETEVENT.TOCLIENT, "joined roomm : " + roomid);
  });
  socket.on(SOCKETEVENT.MESSAGEROOM, function(msg){
    console.log("[" + this.id + "] " + 'messageroom : ' + msg);
    var msgs = msg.split(",");
    if(msgs.length != 2) return;

    io.to(msgs[0]).emit(SOCKETEVENT.TOCLIENT, msgs[1]);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// appidの存在チェック
function checkAppId(appid) {
  if(APPID_CHECK) {
    if(!appid) return false;
    if(APPIDS.indexOf(appid) < 0) {
      return false;
    }
  }
  return true;
}

