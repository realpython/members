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
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  describe('if unauthenticated', function() {
    describe('GET /auth/log_out', function() {
      it('should redirect to sign up page', function(done) {
        chai.request(server)
        .get('/auth/log_out')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Try Textbook</h1>');
          res.text.should.contain(
            '<li><a href="/auth/github">Sign in with Github</a></li>');
          res.text.should.not.contain('<li><a href="/auth/log_out"><i class="fa fa-fw fa-power-off"></i> Log Out</a></li>');
          done();
        });
      });
    });
    describe('GET /auth/sign_up', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/auth/sign_up')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Try Textbook</h1>');
          res.text.should.contain(
            '<li><a href="/auth/github">Sign in with Github</a></li>');
          res.text.should.not.contain('<li><a href="/auth/log_out"><i class="fa fa-fw fa-power-off"></i> Log Out</a></li>');
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
    describe('GET /auth/log_out', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/auth/log_out')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Try Textbook</h1>');
          res.text.should.contain(
            '<li><a href="/auth/github">Sign in with Github</a></li>');
          res.text.should.not.contain(
            '<li><a href="/auth/log_out"><i class="fa fa-fw fa-power-off"></i> Log Out</a></li>');
          done();
        });
      });
    });
    describe('GET /auth/sign_up', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/auth/sign_up')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.not.contain(
            '<li><a href="/auth/github">Sign in with Github</a></li>');
          res.text.should.contain(
            '<li><a href="/auth/log_out"><i class="fa fa-fw fa-power-off"></i> Log Out</a></li>');
          done();
        });
      });
    });
  });

});
