var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('web'))

//This is the web server
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
