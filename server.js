// require express framework
var express = require('express');
// create an express server
var app = express.createServer(express.logger());
// require and create a socket.io instance
var io = require('socket.io').listen(app);

// Setup static file serving from the public folder.
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

// Try to get the port from the environment, otherwise set it to 5000.
var port = process.env.PORT || 5000;

// Start the app
app.listen(port, function() {
  console.log('Listening on ' + port);
});

// Set up socket listeners when a connection is opened.
io.sockets.on('connection', function(socket) {

  // Emit a socket message after connection, call it a "welcome" event.
  socket.emit('welcome', {welcomeAt: Date.now()});

  // Broadcast that a new user has joined. This emit will go to all clients
  // except the originator.
  socket.broadcast.emit('join', {welcome: 'new user'});

  // Listen for a 'mouseClicked' message from the client, and broadcast upon
  // receipt.
  socket.on('mouseClicked', function(data) {
    socket.broadcast.emit('addedCell', {x: data.x, y: data.y});
  });
});