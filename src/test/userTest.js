var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:8080');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CollaborativeMusicPlayer');
var user = require("../lib/schemas/userSchema");


describe('User', function() {
  before(function(done) {
    user.remove({}, done);
  });
  it('should return 200 and create a new user', function(done) {
    api.post('/users')
      .send({
        email:'test@test.com',
        password: 'passwordtest',
        username: 'testusername'
      })
      .expect(200, done);
  });
});

describe('User same email', function(){
  before(function(done) {
    user.remove({}, done);
  });
  it('should return 400 and not create a new user', function(done){
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'testusername'
    }).expect(200, function(){
        api.post('/users')
        .send({
          email:'test@test.com',
          password: 'amitThings'
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

describe('User same username', function(){
  before(function(done) {
    user.remove({}, done);
  });
  it('should return 400 and not create a new user', function(done){
    api.post('/users')
    .send({
      email:'test1@test.com',
      password: 'passwordtest',
      username: 'sameUsername'
    }).expect(200, function(){
      api.post('/users')
      .send({
          email:'test2@test.com',
          password: 'amitThings'
          username: 'sameUsername'
      })
      .expect(400, done);
    });
    api.post('/users')
    .send({
      email:'test2@test.com',
      password: 'amitThings',
      username: 'sameUsername'
    })
    .expect(400, done);
  });
});

describe("getUsers 0 length test", function(){
  before(function(done) {
    user.remove({}, done);
  });
  before(function(done){
    setTimeout(function(){
      var arr = api.get('/users');
      done();
    }, 10000);
  });
  it('should return an array of 0 length', function(done){
    expect(arr.length).equals(0);
  });
});

describe("login receive a 200", function(){
  before(function(done){
    user.remove({}, done);
  });
  it('should return a 200', function(done){
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'username'
    }).expect(200, function(){
      api.post('/users/login')
      .send({
          email:'test@test.com',
          password: 'passwordtest'
      })
      .expect(200, done);
    });
  });
});

describe("login receive a token", function(){
  before(function(done){
    user.remove({}, done);
  });
  before(function (done){
    setTimeout(function(){
      api.post('/users')
      .send({
        email:'test@test.com'
        password: 'passwordtest'
        username: 'username'
      });
      var token = api.post('/users/login')
      .send({
          email:'test@test.com',
          password: 'passwordtest'
      });
      done();
    }, 10000);
  });
  it('should return a token', function(done){
    assert.notEqual(token);
  });
});

describe("login failed", function(){
  before(function(done){
    user.remove({}, done);
  });
  it('should return a 400 status', function(done){
    api.post('/users')
    .send({
      email:'test@test.com',
      password: 'passwordtest',
      username: 'username'
    }).expect(200, function(){
      api.post('/users/login')
      .send({
          email:'test@test.com',
          password: 'passwordFAIL'
      })
      .expect(400, done);
    });
  });
});

describe("delete da user", function(){
  before(function(done){
    user.remove({}, done);
  });
  before(function(done){
    setTimeout(function(){
      api.post('/users')
      .send({
        email:'test@test.com',
        password: 'passwordtest',
        username: 'username'
      });
      var tokenToPass = api.post('/users/login')
      .send({
          email:'test@test.com',
          password: 'passwordtest'
      });
      done();
    },10000);
  });
  it('should return a status of 204', function(done){
    api.delete('/users')
    .send({
        token: tokenToPass
    })
    .expect(204, done);
  });
});
