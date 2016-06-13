process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : auth', function() {

  beforeEach(function(done) {
    passportStub.logout();
    knex.migrate.latest()
    .then(function() {
      done();
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
      .then(function() {
        done();
      });
  });

  describe('if unauthenticated', function() {
    describe('GET /auth/logout', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/auth/logout')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h1 class="page-header">Textbook<small>&nbsp;learning management system</small</h1>');
          res.text.should.contain(
            '<li><a href="/auth/github">Sign in with Github</a></li>');
          res.text.should.not.contain('<a href="/auth/logout">Log out</a>');
          res.text.should.not.contain(
            '<h1 class="page-header">Textbook<small>&nbsp;dashboard</small</h1>');
          done();
        });
      });
    });
  });

  describe('if authenticated', function() {
    beforeEach(function(done) {
      testHelpers.authenticateUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /auth/logout', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/auth/logout')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h1 class="page-header">Textbook<small>&nbsp;learning management system</small</h1>');
          res.text.should.contain(
            '<li><a href="/auth/github">Sign in with Github</a></li>');
          res.text.should.not.contain(
            '<a href="/auth/logout">Log out</a>');
          done();
        });
      });
    });
  });

});