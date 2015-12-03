var socket;
var socket_status = SOCKETSTATUS.NONE;

$(function(){
  $('#msg').val("test msg : " + getRandomString(8));

  $('#connect').click(function(){
    connect();
  });

  // メッセージ送信
  $('#send').click(function(){
    if(canSendMessage()) {
      sendMessage(getMessage());
    } else {
      alert("please connect and set message");
    }
  });

  // 接続している全ユーザにメッセージ送信
  $('#sendall').click(function(){
    if(canSendMessage()) {
      sendMessageAll(getMessage());
    } else {
      alert("please connect and set message");
    }
  });

  // 接続している全ユーザにメッセージ送信
  $('#joinroom').click(function(){
    if(canSendJoin()) {
      sendMessageJoin(getRoomId());
    } else {
      alert("please connect and set roomid");
    }
  });

  // 接続している全ユーザにメッセージ送信
  $('#sendroom').click(function(){
    if(canSendJoin() && canSendMessage()) {
      sendMessageRoom(getRoomId() + "," + getMessage());
    } else {
      alert("please connect and set roomid");
    }
  });
});

// 接続状況の更新
function changeState(status){
  socket_status = status;

  // statusの表示
  var msg = "none..";
  switch (status){
    case SOCKETSTATUS.NONE:
      msg = "none..";
      break;
    case SOCKETSTATUS.CONNECT:
      msg = "connect [id:" + socket.id + "]";
      break;
    case SOCKETSTATUS.DISCONNECT:
      msg = "disconnect";
      break;
    case SOCKETSTATUS.RECONNECT:
      msg = "reconnect";
      break;
  }

  $("#status").html(msg);
}

// 接続
function connect(){
  if(socket_status == SOCKETSTATUS.NONE){
    var host = $("#host").val();
    socket = io(host);
    socketInit();
  }
}

// メッセージを取得
function getMessage() {
  return $("#msg").val();
}

// メッセージを取得
function getRoomId() {
  return $("#roomid").val();
}

// メッセージを送れるか確認
function canSendMessage()
{
  if(socket_status == SOCKETSTATUS.CONNECT){
    if(getMessage()){
      return true;
    }
  }
  return false;
}

// 部屋へのjoinメッセージを送れるか確認
function canSendJoin()
{
  if(socket_status == SOCKETSTATUS.CONNECT){
    if(getRoomId()){
      return true;
    }
  }
  return false;
}

// メッセージ送信
function sendMessage(msg){
  socket.emit(SOCKETEVENT.MESSAGE, msg);
}
function sendMessageAll(msg){
  socket.emit(SOCKETEVENT.MESSAGEALL, msg);
}
function sendMessageJoin(roomid){
  socket.emit(SOCKETEVENT.JOINROOM, roomid);
}
function sendMessageRoom(msg){
  socket.emit(SOCKETEVENT.MESSAGEROOM, msg);
}

// ソケット初期化
function socketInit(){
  socket.on('connect', function(){
    changeState(SOCKETSTATUS.CONNECT);
  });
  socket.on('disconnect', function(){
    changeState(SOCKETSTATUS.DISCONNECT);
  });
  socket.on('reconnect', function(num){
    changeState(SOCKETSTATUS.RECONNECT);
  });
  socket.on('error', function(err){
    alert(err);
  });

  // custom event
  socket.on(SOCKETEVENT.TOCLIENT, function(msg){
    var msgs = $("#msgs").val();
    $("#msgs").val(msg + "\n" +msgs);
  });
}

