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
    describe('GET /admin/chapters/1', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('PUT /admin/chapters/1', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/chapters/1/deactivate', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
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

  describe('if authenticated, active, and verified as a user',
  function() {
    beforeEach(function(done) {
      testHelpers.authenticateAndVerifyActiveUser(done);
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
    describe('GET /admin/chapters/1', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('PUT /admin/chapters/1', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters/1/deactivate', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
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

  describe('if authenticated and verified but inactive', function() {
    beforeEach(function(done) {
      testHelpers.authenticateAndVerifyInactiveUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /admin/chapters', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/chapters')
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
    describe('GET /admin/chapters/1', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('POST /admin/chapters', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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
    describe('PUT /admin/chapters/1', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters/1/deactivate', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
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
    describe('GET /admin/chapters', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/chapters')
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
    describe('GET /admin/chapters/1', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('POST /admin/chapters', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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
    describe('PUT /admin/chapters/1', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters/1', function() {
      it('should return a response', function(done) {
        chapterQueries.getSingleChapter(1)
        .then(function(chapter) {
          chai.request(server)
          .get('/admin/chapters/1')
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('success');
            res.body.data.id.should.equal(chapter[0].id);
            res.body.data.name.should.contain(chapter[0].name);
            res.body.data.read.should.equal(chapter[0].read);
            done();
          });
        });
      });
    });
    describe('GET /admin/chapters/999', function() {
      it('should throw an error if chapter does not exist', function(done) {
        chai.request(server)
        .get('/admin/chapters/999')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
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
      it('should throw an error when duplicate data is used',
      function(done) {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.duplicateChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('text/html');
          res.text.should.contain('<p>Something went wrong!</p>');
          done();
        });
      });
    });
    describe('PUT /admin/chapters/1', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.message.should.equal('Chapter updated.');
          done();
        });
      });
    });
    describe('PUT /admin/chapters/999', function() {
      it('should throw an error if the chapter id does not exist',
        function(done) {
        chai.request(server)
        .put('/admin/chapters/999')
        .send(testHelpers.updateChapter)
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('GET /admin/chapters/1/deactivate', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Chapters</h1>');
          done();
        });
      });
    });
    describe('GET /admin/chapters/999/deactivate', function() {
      it('should redirect to dashboard if the user id does not exist',
        function(done) {
        chai.request(server)
        .get('/admin/chapters/999/deactivate')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.not.contain(
            '<p class="completed">0% Complete</p>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
  });

});
