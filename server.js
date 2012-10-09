// require express framework
var express = require('express');
// create an express server
var app = express.createServer(express.logger());
// require and create a socket.io instance
var io = require('socket.io').listen(app);

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
  response.sendfile(__dirname + '/public/index.html')
})

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log('Listening on ' + port);
});

// Set up socket listeners when a connection is opened.
io.sockets.on('connection', function(socket) {

  // To emit a function, you must also call the function. Maybe don't do this.
  socket.emit('welcome', function() {
    return {welcomeAt: Date.now()}
  }());

  socket.broadcast.emit('join', {welcome: 'new user'});

  socket.on('mouseClicked', function(data) {
    socket.broadcast.emit('addedCell', {x: data.x, y: data.y});
  });
});