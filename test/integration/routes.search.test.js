process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');
var lessonQueries = require('../../src/server/db/queries.lessons');
var chapterQueries = require('../../src/server/db/queries.chapters');
var messageQueries = require('../../src/server/db/queries.messages');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : search', function() {

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
    describe('GET /search?term=deep', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/search?term=deep')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
  });

  describe('if authenticated', function() {
    beforeEach(function(done) {
      testHelpers.authenticateActiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    // describe('GET /search?term=deep', function() {
    //   it('should return a response and show results', function(done) {
    //     chai.request(server)
    //     .get('/search?term=deep')
    //     .end(function(err, res) {
    //       res.redirects.length.should.equal(0);
    //       res.status.should.equal(200);
    //       res.type.should.equal('text/html');
    //       res.text.should.contain('<h1>Search</h1>');
    //       res.results.length.should.equal(3);
    //       done();
    //     });
    //   });
    // });
    describe('GET /search?term=', function() {
      it('should return a response and show results', function(done) {
        chai.request(server)
        .get('/search?term=')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Search</h1>');
          res.text.should.contain('<p>Nothing found.</p>');
          done();
        });
      });
    });
  });

  describe('if authenticated but inactive', function() {
    beforeEach(function(done) {
      testHelpers.authenticateInactiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /search?term=deep', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/search?term=deep')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
  });

});
