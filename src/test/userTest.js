var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;
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

describe('Get User 1', function() {
	before(function(done) {
		user.remove({}, done);
	});
	
	before(function(done){
		setTimeout(function(done){
			api.post('/users')
			.send({
				email:'test@test.com',
				password: 'passwordtest',
				username: 'testusername'
			}).expect(200, function(){
				var userArr = api.get('/users');
				done();
			});
		},10000);
	});
	it('should return user list of length 1', function(done) {
			assert.equal(1, userArr.length);
		
	});
});



describe('Get User Multiple', function() {
	before(function(done) {
		user.remove({}, done);
	});
	before(function(done) {
		setTimeout(function(done){
			api.post('/users')
			.send({
				email:'test@test.com',
				password: 'passwordtest',
				username: 'testusername'
			}).expect(200, function() {
				api.post('/users')
				.send({
					email:'test2@test2.com',
					password: 'passwordtest2',
					username: 'testusername2'
				}).expect(200, function() {
					var userArr = api.get('/users');
					done();
				});
					
			});
		},10000);
	});
	it('should return user list of length 2', function(done) {
		assert.equal(2, userArr.length);
	});
});

describe('Get User json', function() {
	before(function(done) {
		user.remove({}, done);
	});
	before(function(done) {
		setTimeout(function(done){
			api.post('/users')
			.send({
				email:'test@test.com',
				password: 'passwordtest',
				username: 'testusername'
			}).expect(200, function() {
				var tk = api.post('/users/login')
				.send({
					email:'test@test.com',
					password: 'passwordtest'
				});
			});
			var jsonobj = api.post('/user').send({token:tk});
		});
	});
	it('should return json with user info', function(done) {
		assert.isNotNull(jsonobj);
	});
});

describe('Try to get User json with no token', function() {
	before(function(done) {
		user.remove({}, done);
	});
	before(function(done) {
		setTimeout(function(done){
			api.post('/users')
			.send({
				email:'test@test.com',
				password: 'passwordtest',
				username: 'testusername'
			}).expect(200, function() {
				var tk = api.post('/users/login')
				.send({
					email:'test@test.com',
					password: 'passwordtest'
				});
			});
			var jsonobj = api.post('/user').send({token:''});
		});
	});
	it('should return json with user info', function(done) {
		assert.isNull(jsonobj);
	});
});

describe('try to delete user without token', function() {
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
			api.post('/users/login')
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
			token: ''
		})
		.expect(400, done);
	});
});

