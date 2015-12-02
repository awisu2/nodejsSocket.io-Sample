// ランダム文字
function getRandomString(len) {
  var seed = "abcdefghijklmnopqrstuvwxyz0123456789";
  var l = seed.length;
  var r = "";
  for(var i=0; i<len; i++){
    r += seed[ Math.floor( Math.random()*l) ];
  }
  return r;
}


