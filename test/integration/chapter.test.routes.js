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

describe('routes : chapter', function() {

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
    describe('GET /chapter/:id', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/chapter/1')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Try Textbook</h1>');
          done();
        });
      });
    });
    describe('GET /chapter/:id/update?read=true', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/chapter/:id/update?read=true')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Try Textbook</h1>');
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
    describe('GET /chapter/:id', function() {
      it('should return a response', function(done) {
        chapterQueries.getChapters()
        .then(function(chapters) {
          chai.request(server)
          .get('/chapter/' + chapters[0].id)
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + chapters[0].name + '</h1>');
            done();
          });
        });
      });
    });
    describe('GET /chapter/:id', function() {
      it('should redirect to the dashboard if the chapter is invalid',
        function(done) {
        chai.request(server)
        .get('/chapter/999')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          done();
        });
      });
    });
    describe('GET /chapter/:id/update?read=true', function() {
      it('should redirect to the dashboard', function(done) {
        chapterQueries.getChapters()
        .then(function(chapters) {
          chai.request(server)
          .get('/chapter/' + chapters[0].id + '/update?read=true')
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
    describe('GET /chapter/:id/update?read=999', function() {
      it('should throw an error if the query string read is not a boolean', function(done) {
        chapterQueries.getChapters()
        .then(function(chapters) {
          chai.request(server)
          .get('/chapter/' + chapters[0].id + '/update?read=999')
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            done();
          });
        });
      });
    });
  });

});