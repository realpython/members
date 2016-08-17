process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../server/db/knex');
var server = require('../../server/app');
var userQueries = require('../../server/db/queries.users');
var usersAndLessonsQueries = require('../../server/db/queries.users_lessons');
var testHelpers = require('../helpers');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : users', function() {

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
    describe('GET /admin/users', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/users')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/users/1', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/users/1')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /admin/users', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('PUT /admin/users/1', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/users/1/deactivate', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/users/1/unverify', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/admin/users/1/unverify')
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
    describe('GET /admin/users', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/users')
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
    describe('GET /admin/users/1', function() {
      it('should redirect to the dashboard', function(done) {
        chai.request(server)
        .get('/admin/users/1')
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
    describe('POST /admin/users', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
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
    describe('PUT /admin/users/1', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
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
    describe('GET /admin/users/1/deactivate', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .get('/admin/users/1/deactivate')
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
    describe('GET /admin/users/1/unverify', function() {
      it('should redirect to dashboard', function(done) {
        chai.request(server)
        .get('/admin/users/1/unverify')
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
    describe('GET /admin/users', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/users')
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
    describe('GET /admin/users/1', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/users/1')
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
    describe('POST /admin/users', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
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
    describe('PUT /admin/users/1', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
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
    describe('GET /admin/users/1/deactivate', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/users/1/deactivate')
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
    describe('GET /admin/users/1/unverify', function() {
      it('should redirect to the inactive page', function(done) {
        chai.request(server)
        .get('/admin/users/1/unverify')
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
    describe('GET /admin/users', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/users')
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
    describe('GET /admin/users/1', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/users/1')
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
    describe('POST /admin/users', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
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
    describe('PUT /admin/users/1', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
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
    describe('GET /admin/users/1/deactivate', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/users/1/deactivate')
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
    describe('GET /admin/users/1/unverify', function() {
      it('should redirect to the not verified page', function(done) {
        chai.request(server)
        .get('/admin/users/1/unverify')
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
    describe('GET /admin/users', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/admin/users')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          res.text.should.contain('<!-- breadcrumbs -->');
          done();
        });
      });
    });
    describe('GET /admin/users/1', function() {
      it('should return a response', function(done) {
        chai.request(server)
        .get('/admin/users/1')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.data.id.should.equal(1);
          res.body.data.github_id.should.equal(987);
          res.body.data.email.should.equal('michael@johnson.com');
          done();
        });
      });
    });
    describe('GET /admin/users/999', function() {
      it('should throw an error if user does not exist', function(done) {
        chai.request(server)
        .get('/admin/users/999')
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('POST /admin/users', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          done();
        });
      });
    });
    describe('POST /admin/users', function() {
      it('should add new rows to the \'users_lessons\' table',
      function(done) {
        usersAndLessonsQueries.getAllUsersAndLessons()
        .then(function(results) {
          results.length.should.equal(14);
          chai.request(server)
          .post('/admin/users')
          .send(testHelpers.sampleUser)
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Users</h1>');
            // check database for added rows to users_queries
            userQueries.getSingleUserByUsername(
              testHelpers.sampleUser.githubDisplayName)
            .then(function(user) {
              var userID = parseInt(user[0].id);
              usersAndLessonsQueries.getUsersAndLessonsByUserID(userID)
              .then(function(results) {
                results.length.should.equal(7);
                usersAndLessonsQueries.getAllUsersAndLessons()
                .then(function(results) {
                  results.length.should.equal(21);
                  done();
                });
              });
            });
          });
        });
      });
    });
    describe('POST /admin/users', function() {
      it('should throw 500 error when duplicate data is used',
      function(done) {
        userQueries.getTotalUsers()
        .then(function(totalUsers) {
          totalUsers[0].count.should.equal('2');
          chai.request(server)
          .post('/admin/users')
          .send(testHelpers.duplicateUser)
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            res.text.should.contain('<p>Something went wrong!</p>');
            res.text.should.not.contain('<h1>Users</h1>');
            userQueries.getTotalUsers()
            .then(function(totalUsers) {
              totalUsers[0].count.should.equal('2');
              done();
              // TODO: does this log an error to the logger file?
            });
          });
        });
      });
    });
    describe('POST /admin/users', function() {
      it('should not add new rows to the \'users_lessons\' table when duplicate data is used',
      function(done) {
        usersAndLessonsQueries.getAllUsersAndLessons()
        .then(function(results) {
          results.length.should.equal(14);
          chai.request(server)
          .post('/admin/users')
          .send(testHelpers.duplicateUser)
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            res.text.should.contain('<p>Something went wrong!</p>');
            res.text.should.not.contain('<h1>Users</h1>');
            // check database for added rows to users_queries
            userQueries.getSingleUserByUsername(
              testHelpers.duplicateUser.githubDisplayName)
            .then(function(user) {
              user.length.should.equal(0);
              usersAndLessonsQueries.getAllUsersAndLessons()
              .then(function(results) {
                results.length.should.equal(14);
                done();
              });
            });
          });
        });
      });
    });
    describe('PUT /admin/users/1', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.message.should.equal('User updated.');
          done();
        });
      });
    });
    describe('PUT /admin/users/999', function() {
      it('should throw an error if the user id does not exist',
        function(done) {
        chai.request(server)
        .put('/admin/users/999')
        .send(testHelpers.updateUser)
        .end(function(err, res) {
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('GET /admin/users/1/deactivate', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          done();
        });
      });
    });
    describe('GET /admin/users/999/deactivate', function() {
      it('should redirect to dashboard if the user id does not exist',
        function(done) {
        chai.request(server)
        .get('/admin/users/999/deactivate')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.not.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
    describe('GET /admin/users/1/unverify', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .get('/admin/users/1/unverify')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          done();
        });
      });
    });
    describe('GET /admin/users/999/unverify', function() {
      it('should redirect to dashboard if the user id does not exist',
        function(done) {
        chai.request(server)
        .get('/admin/users/999/unverify')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.not.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
  });

});
