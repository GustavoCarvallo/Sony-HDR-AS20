var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('web'));
app.use(express.static(__dirname + '/node_modules'));

//This is the web server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){
  socket.on('base64Image', function(base64){
    console.log("####### base 64 start ########");
    console.log("Base 64 : " + base64);
    console.log("####### base 64 end ########");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
