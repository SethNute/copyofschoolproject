var user = require('../schemas/userSchema');

var api = {};

api.logIn = function(req, res, next) {

}

api.getUsers = function(req, res, next) {
  user.find({})
  .exec(function(err, users) {
    if(err) throw err;
    res.send(users);
  });
};

api.newUser = function(req, res, next) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  user.findOne({email: email}, function(err. user) {
    if(user) {
      // user already exists failed request.
    }
    else {
      var newUser = new User({
        email: email,
        username: username,
        password: password,
        coins: 10
      });
      newUser.save(function(err) {
        if (err) {

        }
        else {

        }
      });
    }
  }
};

api.deleteUser = function(req, res, next) {

};

api.updateUser = function(req, res, next) {

};
