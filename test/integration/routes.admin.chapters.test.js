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

describe('routes : admin : chapters', function() {

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
    describe('GET /admin/chapters', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/chapters')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /admin/chapters', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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

  describe('if authenticated as a user', function() {
    beforeEach(function(done) {
      testHelpers.authenticateUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /admin/chapters', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/chapters')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p class="completed">0% Complete</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
    describe('POST /admin/chapters', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p class="completed">0% Complete</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
  });

  describe('if authenticated as an admin', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAdmin(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /admin/chapters', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/admin/chapters')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Chapters</h1>');
          res.text.should.contain('<!-- breadcrumbs -->');
          done();
        });
      });
    });
    describe('POST /admin/chapters', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Chapters</h1>');
          done();
        });
      });
    });
    describe('POST /admin/chapters', function() {
      beforeEach(function(done) {
        testHelpers.authenticateUser(done);
      });
      it('should redirect to dashboard when duplicate data is used',
      function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.duplicateChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p class="completed">0% Complete</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
  });

});