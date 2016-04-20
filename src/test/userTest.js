var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:8080');

describe('User', function() {
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