var express = require('express');
var app = express();

var path = require('path');
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
// run mongo with  "sudo mongod --fork --syslog"
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CollaborativeMusicPlayer');

app.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Starts server
http.listen(8080, function() {
  console.log('Listening on port 8080');
});