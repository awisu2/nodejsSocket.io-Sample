require("./config.js");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/socket', function(req, res){
  res.sendfile('socket.html');
});

// javascriptを返却
app.get('/js', function(req, res){
  var file = req.query.f + ".js";
  res.sendfile(file);
});

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
