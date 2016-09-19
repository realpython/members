process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/knex');
const server = require('../../server/app');
const lessonQueries = require('../../server/db/queries.lessons');
const usersLessonsQueries = require('../../server/db/queries.users_lessons');
const testHelpers = require('../helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : lessons', () => {

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
    describe('GET /admin/lessons', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/lessons')
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
    describe('GET /admin/lessons/1', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/lessons/1')
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
    describe('POST /admin/lessons', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/admin/lessons')
        .send(testHelpers.sampleLesson)
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
    describe('PUT /admin/lessons/1', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .put('/admin/lessons/1')
        .send(testHelpers.updateLesson)
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
    describe('GET /admin/lessons/1/deactivate', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/lessons/1/deactivate')
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
    describe('GET /admin/lessons', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/lessons')
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
    describe('GET /admin/lessons/1', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/lessons/1')
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
    describe('POST /admin/lessons', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .post('/admin/lessons')
        .send(testHelpers.sampleLesson)
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
    describe('PUT /admin/lessons/1', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .put('/admin/lessons/1')
        .send(testHelpers.updateLesson)
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
    describe('GET /admin/lessons/1/deactivate', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/admin/lessons/1/deactivate')
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
    describe('GET /admin/lessons', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/lessons')
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
    describe('GET /admin/lessons/1', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/lessons/1')
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
    describe('POST /admin/lessons', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .post('/admin/lessons')
        .send(testHelpers.sampleLesson)
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
    describe('PUT /admin/lessons/1', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .put('/admin/lessons/1')
        .send(testHelpers.updateLesson)
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
    describe('GET /admin/lessons/1/deactivate', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/admin/lessons/1/deactivate')
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
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /admin/lessons', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/lessons')
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
    describe('GET /admin/lessons/1', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/lessons/1')
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
    describe('POST /admin/lessons', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .post('/admin/lessons')
        .send(testHelpers.sampleLesson)
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
    describe('PUT /admin/lessons/1', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .put('/admin/lessons/1')
        .send(testHelpers.updateLesson)
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
    describe('GET /admin/lessons', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/lessons')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Lessons</h1>');
          res.text.should.contain('<!-- breadcrumbs -->');
          done();
        });
      });
    });
    describe('GET /admin/lessons/1', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/lessons/1')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.data.id.should.equal(1);
          res.body.data.name.should.contain('Lesson');
          done();
        });
      });
    });
    describe('GET /admin/lessons/999', () => {
      it('should throw an error if lesson does not exist', (done) => {
        chai.request(server)
        .get('/admin/lessons/999')
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
    describe('POST /admin/lessons', () => {
      it('should return a 200 response', (done) => {
        lessonQueries.getAllLessons((err, lessons) => {
          const totalLessonsCount = parseInt(lessons.length);
          chai.request(server)
          .post('/admin/lessons')
          .send(testHelpers.sampleLesson)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Lessons</h1>');
            lessonQueries.getAllLessons((err, lessons) => {
              const newCount = parseInt(lessons.length);
              newCount.should.equal(totalLessonsCount + 1);
              done();
            });
          });
        });
      });
    });
    describe('POST /admin/lessons', () => {
      beforeEach((done) => {
        return knex.migrate.rollback()
        .then(() => {
          return knex.migrate.latest();
        })
        .then(() => {
          return knex.seed.run();
        })
        .then(() => {
          const permissions = {
            verified: true,
            admin: true,
            active: true
          };
          testHelpers.authenticate(permissions, done);
        });
      });
      afterEach((done) => {
        return knex.migrate.rollback()
        .then(() => {
          done();
        });
      });
      it('should add new rows to the \'users_lessons\' table', (done) => {
        usersLessonsQueries.getAllUsersAndLessons((err, results) => {
          results.length.should.equal(14);
          chai.request(server)
          .post('/admin/lessons')
          .send(testHelpers.sampleLesson)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Lessons</h1>');
            // check database for added rows to users_queries
            usersLessonsQueries.getAllUsersAndLessons((err, updatedResults) => {
              updatedResults.length.should.equal(16);
              done();
            });
          });
        });
      });
    });
    describe('POST /admin/lessons', () => {
      it('should throw an error if duplicate data is used', (done) => {
        lessonQueries.getAllLessons((err, lessons) => {
          const totalLessonsCount = parseInt(lessons.length);
          chai.request(server)
          .post('/admin/lessons')
          .send(testHelpers.duplicateLesson)
          .end((err, res) => {
            should.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            res.text.should.contain('<p>Something went wrong!</p>');
            lessonQueries.getAllLessons((err, lessons) => {
              const newCount = parseInt(lessons.length);
              newCount.should.equal(totalLessonsCount);
              done();
            });
          });
        });
      });
    });
    describe('POST /admin/lessons', () => {
      it('should not add new rows to the \'users_lessons\' table when duplicate data is used', (done) => {
        usersLessonsQueries.getAllUsersAndLessons((err, results) => {
          const totalLessonsCount = parseInt(results.length);
          chai.request(server)
          .post('/admin/lessons')
          .send(testHelpers.duplicateLesson)
          .end((err, res) => {
            should.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            res.text.should.contain('<p>Something went wrong!</p>');
            usersLessonsQueries.getAllUsersAndLessons((err, lessons) => {
              const newCount = parseInt(lessons.length);
              newCount.should.equal(totalLessonsCount);
              done();
            });
          });
        });
      });
    });
    describe('PUT /admin/lessons/1', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .put('/admin/lessons/1')
        .send(testHelpers.updateLesson)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.message.should.equal('Lesson updated.');
          done();
        });
      });
    });
    describe('PUT /admin/lessons/999', () => {
      it('should throw an error if the lesson id does not exist', (done) => {
        chai.request(server)
        .put('/admin/lessons/999')
        .send(testHelpers.updateLesson)
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
    describe('GET /admin/lessons/1/deactivate', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .get('/admin/lessons/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Lessons</h1>');
          done();
        });
      });
    });
    describe('GET /admin/lessons/999/deactivate', () => {
      it('should redirect to dashboard if the user id does not exist',
        (done) => {
        chai.request(server)
        .get('/admin/lessons/999/deactivate')
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
