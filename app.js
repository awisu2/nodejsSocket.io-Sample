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

// ルータをセット
app.use(html);
app.use("/js", js);

// socket event
io.on('connection', function(socket){
  var id = socket.id;
  var idstr = "[" + id + "] ";
  console.log('connection : id = ' + id);

  // イベントの登録
  socket.on('disconnect', function(){
    console.log(idstr + 'disconnect');
  });
  socket.on(SOCKETEVENT.MESSAGE, function(msg){
    console.log(idstr + 'message : ' + msg);
    // 返却
    this.emit(SOCKETEVENT.TOCLIENT, msg);
  });
  socket.on(SOCKETEVENT.MESSAGEALL, function(msg){
    console.log(idstr + 'messageall : ' + msg);
    // 返却
    io.emit(SOCKETEVENT.TOCLIENT, msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
