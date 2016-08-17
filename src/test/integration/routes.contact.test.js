process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../server/db/knex');
var server = require('../../server/app');
var chapterQueries = require('../../server/db/queries.chapters');
var lessonQueries = require('../../server/db/queries.lessons');
var testHelpers = require('../helpers');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : contact', function() {

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
    describe('GET /contact', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/contact')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /contact', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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
    describe('GET /contact', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/contact')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('class="contact-form"');
          res.text.should.contain('<a href="#" class="dropdown-toggle avatar-link" data-toggle="dropdown"><img class="avatar" src="https://avatars.io/static/default_128.jpg">&nbsp;Michael Herman <b class="caret"></b></a>');
          done();
        });
      });
    });
    describe('POST /contact', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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
    describe('GET /contact', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/contact')
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
    describe('POST /contact', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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

  describe('if authenticated and active but unverified', function() {
    beforeEach(function(done) {
      testHelpers.authenticateActiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /contact', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/contact')
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
    describe('POST /contact', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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
