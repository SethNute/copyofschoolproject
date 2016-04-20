var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  username: String,
  password: String,
  coins: Number
});

module.exports = mongoose.model('user', userSchema);
