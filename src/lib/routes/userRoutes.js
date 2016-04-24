var user = require('../schemas/userSchema');

var api = {};
var jwt = require('jsonwebtoken');

api.verifyUser = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token) {
    jwt.verify(token, app.get('secret'), function(err, decoded) {
      if(err) {
        // not logged in.
        res.status(400);
      }
      req.user = decoded;
      next();
    });
  } else {
    // did not receive a token.
    res.status(403);
  }
}

api.getUser = function(req, res, next) {
  res.json(req.user);
}

api.logIn = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  user.findOne({
    email: email
  }, function(err, user) {
    if(err || !user || user.password !== password) {
      //failed to log in
      res.status(400);
    } else {
      var token = jwt.sign(_user, app.get('secret'),{
        expiresInMinutes: 60
      });
      res.status(200).json({token: token});
    }
  });
}

api.getUsers = function(req, res, next) {
  user.find({})
  .select('_id username password coins')
  .exec(function(err, users) {
    if(err) {
      res.status(400);
    } else {
      res.send(users);
    }
  });
};

api.newUser = function(req, res, next) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  user.findOne({email: email}, function(err, result) {
    if(result) {
      // user already exists failed request.
      res.status(400);
    } else {
      var newUser = new user({
        email: email,
        username: username,
        password: password,
        coins: 10
      });
      newUser.save(function(err) {
        if(err) {
          // couldn't save user for some reason
          res.status(400);
        } else {
          delete newUser.password;
          res.status(200).json(newUser);
        }
      });
    }
  });
};

api.deleteUser = function(req, res, next) {
  var id = req.user.id;
  user.remove({_id:id}, function(err) {
    if(err) {
      // error removing user.
    } else {
      // user removed
      res.status(204);
    }
  });
};

api.updateUser = function(req, res, next) {
  var id = req.user.id;
  var newUser = req.body;
  user.update({_id:id}, newUser, function(err, result) {
    if(err) {
      // unable to update user.
      res.status(400);
    } else {
      res.status(200).json(newUser);
    }
  });
};

module.exports = api;
