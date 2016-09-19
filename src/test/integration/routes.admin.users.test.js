process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/knex');
const server = require('../../server/app');
const userQueries = require('../../server/db/queries.users');
const usersLessonsQueries = require('../../server/db/queries.users_lessons');
const testHelpers = require('../helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : users', () => {

  beforeEach((done) => {
    return knex.migrate.rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex.seed.run();
    })
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    return knex.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('if !authenticated', () => {
    describe('GET /admin/users', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/users')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/users/1', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/users/1')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /admin/users', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('PUT /admin/users/1', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/users/1/deactivate', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/users/1/unverify', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/users/1/unverify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
  });

  describe('if authenticated, active, and verified', () => {
    beforeEach((done) => {
      const permissions = {
        verified: true,
        admin: false,
        active: true
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /admin/users', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/users')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
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
    describe('GET /admin/users/1', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/users/1')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
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
    describe('POST /admin/users', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
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
    describe('PUT /admin/users/1', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
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
    describe('GET /admin/users/1/deactivate', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
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
    describe('GET /admin/users/1/unverify', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/admin/users/1/unverify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
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

  describe('if authenticated, !active, verified', () => {
    beforeEach((done) => {
      const permissions = {
        verified: true,
        admin: false,
        active: false
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /admin/users', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/users')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /admin/users/1', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/users/1')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('POST /admin/users', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('PUT /admin/users/1', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /admin/users/1/deactivate', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /admin/users/1/unverify', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/users/1/unverify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
  });

  describe('if authenticated, active, !verified', () => {
    beforeEach((done) => {
      const permissions = {
        verified: false,
        admin: false,
        active: true
      };
      testHelpers.authenticate(permissions, done);
    });
    describe('GET /admin/users', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/users')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('GET /admin/users/1', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/users/1')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('POST /admin/users', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('PUT /admin/users/1', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('GET /admin/users/1/deactivate', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('GET /admin/users/1/unverify', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/users/1/unverify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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

  describe('if admin', () => {
    beforeEach((done) => {
      const permissions = {
        verified: true,
        admin: true,
        active: true
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /admin/users', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/users')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          res.text.should.contain('<!-- breadcrumbs -->');
          done();
        });
      });
    });
    describe('GET /admin/users/1', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/users/1')
        .end((err, res) => {
          should.not.exist(err);
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
    describe('GET /admin/users/999', () => {
      it('should throw an error if user does not exist', (done) => {
        chai.request(server)
        .get('/admin/users/999')
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('POST /admin/users', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .post('/admin/users')
        .send(testHelpers.sampleUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          done();
        });
      });
    });
    describe('POST /admin/users', () => {
      it('should add new rows to the \'users_lessons\' table', (done) => {
        usersLessonsQueries.getAllUsersAndLessons((err, results) => {
          results.length.should.equal(14);
          chai.request(server)
          .post('/admin/users')
          .send(testHelpers.sampleUser)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Users</h1>');
            // check database for added rows to users_queries
            const username = testHelpers.sampleUser.githubDisplayName;
            userQueries.getSingleUserByUsername(username, (err, user) => {
              const userID = parseInt(user[0].id);
              usersLessonsQueries.getUsersAndLessonsByUserID(
                userID, (err, usersAndLessons) => {
                usersAndLessons.length.should.equal(7);
                usersLessonsQueries.getAllUsersAndLessons((err, all) => {
                  all.length.should.equal(21);
                  done();
                });
              });
            });
          });
        });
      });
    });
    describe('POST /admin/users', () => {
      it('should throw 500 error when duplicate data is used', (done) => {
        userQueries.getTotalUsers((err, totalUsers) => {
          totalUsers[0].count.should.equal('2');
          chai.request(server)
          .post('/admin/users')
          .send(testHelpers.duplicateUser)
          .end((err, res) => {
            should.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            res.text.should.contain('<p>Something went wrong!</p>');
            res.text.should.not.contain('<h1>Users</h1>');
              userQueries.getTotalUsers((err, totalUsersAgain) => {
              totalUsersAgain[0].count.should.equal('2');
              done();
            });
          });
        });
      });
    });
    describe('POST /admin/users', () => {
      it('should not add new rows to the \'users_lessons\' table when duplicate data is used', (done) => {
        usersLessonsQueries.getAllUsersAndLessons((err, results) => {
          results.length.should.equal(14);
          chai.request(server)
          .post('/admin/users')
          .send(testHelpers.duplicateUser)
          .end((err, res) => {
            should.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            res.text.should.contain('<p>Something went wrong!</p>');
            res.text.should.not.contain('<h1>Users</h1>');
            // check database for added rows to users_queries
            const username = testHelpers.sampleUser.githubDisplayName;
            userQueries.getSingleUserByUsername(username, (err, user) => {
              user.length.should.equal(0);
              usersLessonsQueries.getAllUsersAndLessons((err, all) => {
                all.length.should.equal(14);
                done();
              });
            });
          });
        });
      });
    });
    describe('PUT /admin/users/1', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .put('/admin/users/1')
        .send(testHelpers.updateUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.message.should.equal('User updated.');
          done();
        });
      });
    });
    describe('PUT /admin/users/999', () => {
      it('should throw an error if the user id does not exist', (done) => {
        chai.request(server)
        .put('/admin/users/999')
        .send(testHelpers.updateUser)
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('GET /admin/users/1/deactivate', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .get('/admin/users/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          done();
        });
      });
    });
    describe('GET /admin/users/999/deactivate', () => {
      it('should redirect to dashboard if the user id does not exist',
      (done) => {
        chai.request(server)
        .get('/admin/users/999/deactivate')
        .end((err, res) => {
          should.not.exist(err);
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
    describe('GET /admin/users/1/unverify', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .get('/admin/users/1/unverify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Users</h1>');
          done();
        });
      });
    });
    describe('GET /admin/users/999/unverify', () => {
      it('should redirect to dashboard if the user id does not exist',
        (done) => {
        chai.request(server)
        .get('/admin/users/999/unverify')
        .end((err, res) => {
          should.not.exist(err);
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
