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

describe('routes : index', function() {

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
    describe('GET /ping', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/ping')
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.equal('pong!');
          done();
        });
      });
    });
    describe('GET /', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /doesnotexist', function() {
      it('should throw an error', function(done) {
        chai.request(server)
        .get('/doesnotexist')
        .end(function(err, res) {
          res.status.should.equal(404);
          res.type.should.equal('text/html');
          res.text.should.contain('<p>That page cannot be found.</p>');
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
    describe('GET /', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p class="completed">0% Complete</p>');
          done();
        });
      });
    });
    describe('GET /', function() {
      it('should show the correct course status', function(done) {
        chapterQueries.getChapters()
        .then(function(chapters) {
          chapterQueries.updateChapterReadStatus(chapters[0].id, true)
          .then(function(response) {
            chai.request(server)
            .get('/')
            .end(function(err, res) {
              res.redirects.length.should.equal(0);
              res.status.should.equal(200);
              res.type.should.equal('text/html');
              res.text.should.contain('<h1>Dashboard</h1>');
              res.text.should.contain(
                '<p class="completed">33% Complete</p>');
              done();
            });
          });
        });
      });
    });
  });

});
