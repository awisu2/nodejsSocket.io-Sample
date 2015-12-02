var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.get('/socket', function(req, res){
  res.sendfile('socket.html');
});


// socket event
var SOCKETEVENT = {
  MESSAGE    : "message",
  MESSAGEALL : "messageall",
  TOCLIENT   : "message_toclient",
}

io.on('connection', function(socket){
  console.log('connection');

  // イベントの登録
  socket.on('disconnect', function(){
    console.log('disconnect');
  });
  socket.on(SOCKETEVENT.MESSAGE, function(msg){
    console.log('message : ' + msg);
    // 返却
    this.emit(SOCKETEVENT.TOCLIENT, msg);
  });
  socket.on(SOCKETEVENT.MESSAGEALL, function(msg){
    console.log('messageall : ' + msg);
    // 返却
    io.emit(SOCKETEVENT.TOCLIENT, msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
