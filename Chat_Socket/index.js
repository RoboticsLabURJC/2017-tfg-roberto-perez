var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

function Usuario(nick, socket) {
    this.nick = nick;
    this.socket = socket;
}

function checkUser(user) {
    for (i = 0; i < users.length; i++) {
        if (user == users[i].nick) {
            return true
        }
    }
    return false;
}


io.on('connection', function(socket){
  socket.on('login', function(user){
    var i = 0;
    var existe = checkUser(user);
    if (existe) {
        socket.emit('conexion', existe);
    } else {
        for (i = 0; i < users.length; i++) {
            if (users[i].nick != user) {
                socket.emit('conexion', users[i].nick);
            }
        }
        users.push(new Usuario(user, socket));
        console.log(user + " a entrado en el chat");
        socket.broadcast.emit('conexion', user);
    }
    });
    socket.on('chat message', function(msg){
    for (i = 0; i < users.length; i++) {
      if (users[i].socket == socket) {
        msg = users[i].nick + ": " + msg;
       }
    }
    io.emit('chat message', msg);
    });
    
    socket.on('disconnect', function(){
    for (i = 0; i < users.length; i++) {
      if (users[i].socket == socket) {
        var msg = users[i].nick
        console.log(msg + " a abandonado el chat");
        users.splice(i,1);
    }
   }
   if (msg != "") {
    socket.broadcast.emit('discon', msg);
   }
  });    
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
