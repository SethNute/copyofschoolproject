var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;
var supertest = require('supertest');
var api = supertest('http://localhost:8080');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CollaborativeMusicPlayer');
var user = require("../lib/schemas/userSchema");

describe('Registration', function() {
  before(function(done) {
    user.remove({}, done);
  });
  it('Valid registration', function(done) {
    api.post('/users')
      .send({
        email:'test@test.com',
        password: 'passwordtest',
        username: 'testusername'
      })
      .expect(200, done);
  });
  it('Duplicate username registration.', function(done) {
    api.post('/users')
    .send({
      email:'test1@test.com',
      password: 'passwordtest',
      username: 'sameUsername'
    }).expect(200, function(){
      api.post('/users')
      .send({
          email:'test2@test.com',
          password: 'amitThings',
          username: 'sameUsername'
      })
      .expect(400, done);
    });
  });
  it('Duplicate email registration', function(done){
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'testusername'
    }).expect(200, function(){
          api.post('/users')
          .send({
            email:'test@test.com',
            password: 'amitThings',
            username: 'amitIsSilly'
      })
      .expect(200, function() {
        api.post('/users')
        .send({
          email:'test@test.com',
          password: 'amitThings',
          username: 'amitIsSilly'
        })
        .expect(400, done);
      });
    });
  });
});

describe('Login', function() {
  before(function(done){
    user.remove({}, function() {
      api.post('/users')
      .send({
        email:'test@test.com',
        password: 'passwordtest',
        username: 'username'
      })
      .end(done);
    });
  });
  it('Successful log in', function(done) {
    api.post('/users/login')
    .send({
      email:'test@test.com',
      password: 'passwordtest'
    })
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      res.body.should.have.property('token');
      done();
    });
  });
  it('Invalid password log in', function(done){
    api.post('/users/login')
    .send({
        email:'test@test.com',
        password: 'passwordFAIL'
    })
    .expect(400, done);
  });
});


describe('Retrieve Leaderboard', function() {
  before(function(done) {
    user.remove({}, done);
  });
  it('Get leaderboard with no users', function(done) {
    api.get('/leaderboard')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.body.length.should.equal(0);
        done();
      });
  });
  it('Get leaderboard with single user', function(done) {
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'testusername'
    }).expect(200, function() {
      api.get('/leaderboard')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.body.length.should.equal(1);
        done();
      });
    });
  });
  it('Get leaderboard with multiple users', function(done) {
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'testusername'
    })
    .expect(200, function() {
      api.post('/users')
      .send({
        email:'a@a.com',
        password: 'passwordtest',
        username: 'a'
      })
      .end(function() {
        api.get('/leaderboard')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          res.body.length.should.equal(2);
          done();
        });
      });
    });
  });
});

describe('Retrieve All Users', function() {
  before(function(done) {
    user.remove({}, done);
  });
  it('Get empty array of users', function(done) {
    api.get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.body.length.should.equal(0);
        done();
      });
  });
  it('Get single user', function(done) {
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'testusername'
    }).expect(200, function() {
      api.get('/users')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.body.length.should.equal(1);
        done();
      });
    });
  });
  it('Get multiple users', function(done) {
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'testusername'
    })
    .expect(200, function() {
      api.post('/users')
      .send({
        email:'a@a.com',
        password: 'passwordtest',
        username: 'a'
      })
      .end(function() {
        api.get('/users')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          res.body.length.should.equal(2);
          done();
        });
      });
    });
  });
});


describe('Authorized user operations', function() {
  before(function(done) {
    user.remove({}, function() {
      api.post('/users')
      .send({
        email:'test@test.com',
        password: 'passwordtest',
        username: 'testusername'
      })
      .end(function() {
        api.post('/users')
        .send({
          email:'1@1.com',
          password: 'passwordtest',
          username: '1'
        })
        .end(done);
      });
    });
  });
  it('Get current user based off of token', function(done) {
    api.post('/users/login')
    .send({
      email:'test@test.com',
      password: 'passwordtest'
    })
    .end(function(err, res) {
      api.post('/user')
      .send({
        token: res.body.token,
      })
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        res.body.email.should.equal('test@test.com');
        done();
      });
    });
  });
  it('Updates the currently logged in user', function(done){
    api.post('/users/login')
    .send({
      email:'test@test.com',
      password: 'passwordtest'
    })
    .end(function(err, res) {
      api.put('/users')
      .send({
        token: res.body.token,
        user: {
          email:'a@a.com',
          password: 'aa',
          username: 'aaaa'
        }
      })
      .expect(200, done);
    });
  });
  it('Delete the currently logged in user', function(done){
    api.post('/users/login')
    .send({
      email:'1@1.com',
      password: 'passwordtest'
    })
    .end(function(err, res) {
      api.delete('/users')
      .send({
        token: res.body.token
      })
      .expect(200, done);
    })
  });

});

describe('Unauthorized requests - Invalid token', function() {
	before(function(done) {
		user.remove({}, done);
	});
  it('Bad get user request', function(done) {
    api.post('/user')
    .send({
      token: 'asidfjlkmasdfa'
    })
    .expect(400, done);
  });
  it('Bad delete request', function(done) {
    api.post('/user')
    .send({
      token: 'aosdlkfasdf'
    })
    .expect(400, done);
  });
  it('Bad update request', function(done) {
    api.put('/users')
    .send({
      token: 'asidkfasdf'
    })
    .expect(400, done);
  });
});

describe('Unauthorized requests - No token', function() {
    before(function(done) {
    user.remove({}, done);
  });
  it('Empty token get user request', function(done) {
    api.post('/user')
    .send({
    })
    .expect(403, done);
  });
  it('Empty token delete request', function(done) {
    api.post('/user')
    .send({
    })
    .expect(403, done);
  });
  it('Empty token update request', function(done) {
    api.put('/users')
    .send({
    })
    .expect(403, done);
  });
});

