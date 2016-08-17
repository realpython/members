process.env.NODE_ENV = 'test';
process.env.CAN_VERIFY = 1;

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../server/db/knex');
var server = require('../../server/app');
var testHelpers = require('../helpers');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : auth', function() {

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
    describe('GET /admin/auth/verification', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/auth/verification')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
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
    describe('GET /admin/auth/verification', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/auth/verification')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end(function(err, res) {
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
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
    describe('GET /admin/auth/verification', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/auth/verification')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
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
    describe('GET /admin/auth/verification', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/auth/verification')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
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
    describe('GET /admin/auth/verification/toggle', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end(function(err, res) {
          res.redirects.length.should.equal(3);
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

  describe('if authenticated as an admin', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAdmin(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /admin/auth/verification', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/admin/auth/verification')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.verified.should.equal(true);
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          res.text.should.contain('Verification status:');
          process.env.CAN_VERIFY = 1;
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', function() {
      it('should update the verification status on the dashboard',
      function(done) {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end(function(err, res) {
          chai.request(server)
          .get('/admin/auth/verification')
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('success');
            res.body.verified.should.equal(false);
            process.env.CAN_VERIFY = 1;
            done();
          });
        });
      });
    });
    describe('GET /admin/auth/verification', function() {
      it('should return a response',
      function(done) {
        chai.request(server)
        .get('/admin/auth/verification')
        .end(function(err, res) {
          chai.request(server)
          .get('/admin/auth/verification')
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('success');
            res.body.verified.should.equal(true);
            process.env.CAN_VERIFY = 1;
            done();
          });
        });
      });
    });
  });

});
