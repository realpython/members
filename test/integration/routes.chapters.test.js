process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');
var chapterQueries = require('../../src/server/db/queries.chapters');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : chapters', function() {

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
    describe('GET /chapters/:id', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/chapters/1')
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

  describe('if authenticated, active, and verified', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAndVerifyActiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /chapters/:id', function() {
      it('should return a response', function(done) {
        chapterQueries.getSingleChapterFromOrder(2)
        .then(function(chapter) {
          chai.request(server)
          .get('/chapters/' + chapter[0].id)
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + chapter[0].name + '</h1>');
            done();
          });
        });
      });
    });
    describe('GET /chapters/:id', function() {
      it('should redirect to the dashboard if the chapter is invalid',
        function(done) {
        chai.request(server)
        .get('/chapters/999')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          done();
        });
      });
    });
  });

  describe('if authenticated and verified but inactive', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAndVerifyInactiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /chapters/:id', function() {
      it('should redirect to the inactive page', function(done) {
        chapterQueries.getSingleChapterFromOrder(2)
        .then(function(chapter) {
          chai.request(server)
          .get('/chapters/' + chapter[0].id)
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
    describe('GET /chapters/:id', function() {
      it('should redirect to the inactive page',
        function(done) {
        chai.request(server)
        .get('/chapters/999')
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

  describe('if authenticated and inactive but unverified', function() {
    beforeEach(function(done) {
      testHelpers.authenticateActiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /chapters/:id', function() {
      it('should redirect to the not verified page', function(done) {
        chapterQueries.getSingleChapterFromOrder(2)
        .then(function(chapter) {
          chai.request(server)
          .get('/chapters/' + chapter[0].id)
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h2>Please verify your account.</h2>');
            res.text.should.not.contain(
              '<h2>Your account is inactive.</h2>');
            done();
          });
        });
      });
    });
    describe('GET /chapters/:id', function() {
      it('should redirect to the not verified page',
        function(done) {
        chai.request(server)
        .get('/chapters/999')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
  });

});
