process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/connection');
const server = require('../../server/app');
const lessonQueries = require('../../server/db/queries/lessons');
const chapterQueries = require('../../server/db/queries/chapters');
const messageQueries = require('../../server/db/queries/messages');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : lessons', () => {

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
    describe('GET /lessons/:id', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/lessons/1')
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
    describe('POST /lessons', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/lessons')
        .send(testHelpers.lessonRead)
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
    describe('GET /lessons/:id', () => {
      it('should return a response', (done) => {
        lessonQueries.getSingleLessonFromOrder(2, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain('<!-- previous lesson button -->');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should show a message', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            res.text.should.contain('<!-- user messages -->');
            res.text.should.contain('<p class="message-author">Michael Johnson said:</p>');
            res.text.should.contain('Awesome lesson!');
            res.text.should.not.contain('Reply');
            res.text.should.not.contain('data-status="hidden"');
            res.text.should.not.contain('data-status="visible"');
            res.text.should.not.contain('<!-- reply link -->');
            res.text.should.not.contain('<!-- deactivate link -->');
            res.text.should.not.contain('<!-- deactivate reply link -->');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should show a new message', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .post('/messages')
          .send({
            comment: 'testing a message',
            lesson: lesson[0].id
          })
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            res.text.should.contain('<!-- user messages -->');
            res.text.should.contain('<p class="message-author">Michael Johnson said:</p>');
            res.text.should.contain('Awesome lesson!');
            res.text.should.contain('testing a message');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should show a new message', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            res.text.should.contain('<!-- user messages -->');
            res.text.should.contain('<p class="message-author">Michael Johnson said:</p>');
            res.text.should.contain('Awesome lesson!');
            const messageObject = {
              content: 'testing a message',
              lesson_id: 1,
              user_id: 1
            };
            messageQueries.addMessage(messageObject)
            .then(() => {
              chai.request(server)
              .get('/lessons/' + lesson[0].id)
              .end((err, res) => {
                should.not.exist(err);
                res.text.should.contain(
                  '<h1>' + lesson[0].name + '</h1>');
                res.text.should.contain('testing a message');
                done();
              });
            });
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should not show an inactive message', (done) => {
        messageQueries.getInactiveMessages((err, messages) => {
          chai.request(server)
          .get('/lessons/' + messages[0].lesson_id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            res.text.should.contain('<!-- user messages -->');
            res.text.should.contain('<p class="message-author">Michael Johnson said:</p>');
            res.text.should.contain('Love it!');
            res.text.should.not.contain('Should not be visible.');
            res.text.should.not.contain('Reply');
            res.text.should.not.contain('data-status="hidden"');
            res.text.should.not.contain('data-status="visible"');
            res.text.should.not.contain('<!-- reply link -->');
            res.text.should.not.contain('<!-- deactivate link -->');
            res.text.should.not.contain('<!-- deactivate reply link -->');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should show only next lesson button', (done) => {
        lessonQueries.getSingleLessonFromOrder(1, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.not.contain('<!-- previous lesson button -->');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should show only previous lesson button', (done) => {
        lessonQueries.getSingleLessonFromOrder(7, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain('<!-- previous lesson button -->');
            res.text.should.not.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', () => {
      // TODO: Handle this error better
      it('should throw an error if the lesson is invalid',
        (done) => {
        chai.request(server)
        .get('/lessons/999')
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('text/html');
          res.text.should.contain('<p>Something went wrong!</p>');
          done();
        });
      });
    });
    describe('GET /lessons/:id', () => {
      it('should display the content as HTML', (done) => {
        lessonQueries.getSingleLessonFromOrder(7, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain(lesson[0].content);
            res.text.should.contain('<!-- previous lesson button -->');
            res.text.should.not.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            done();
          });
        });
      });
    });
    describe('POST /lessons', () => {
      it('should mark the lesson as read', (done) => {
        chai.request(server)
        .post('/lessons')
        .send(testHelpers.lessonRead)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">17% Complete</span><span>&nbsp;(1 lessons)</p>');
          res.text.should.contain('data-lesson-read="true"');
          done();
        });
      });
    });
    describe('POST /lessons', () => {
      it('should mark the lesson as unread', (done) => {
        chai.request(server)
        .post('/lessons')
        .send(testHelpers.lessonRead)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">17% Complete</span><span>&nbsp;(1 lessons)</p>');
          res.text.should.contain('data-lesson-read="true"');
          chai.request(server)
          .post('/lessons')
          .send(testHelpers.lessonUnread)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain(
              '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
            res.text.should.not.contain('data-lesson-read="true"');
            done();
          });
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page', (done) => {
        lessonQueries.getSingleLessonFromOrder(2, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .post('/messages')
          .send({
            comment: 'testing a message',
            lesson: lesson[0].id
          })
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page', (done) => {
        lessonQueries.getSingleLessonFromOrder(1, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page', (done) => {
        lessonQueries.getSingleLessonFromOrder(6, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the inactive page',
        (done) => {
        chai.request(server)
        .get('/lessons/999')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('POST /lessons', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .post('/lessons')
        .send(testHelpers.lessonRead)
        .end((err, res) => {
          should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page', (done) => {
        lessonQueries.getSingleLessonFromOrder(2, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .post('/messages')
          .send({
            comment: 'testing a message',
            lesson: lesson[0].id
          })
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page', (done) => {
        lessonQueries.getSingleLessonFromOrder(1, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page', (done) => {
        lessonQueries.getSingleLessonFromOrder(6, (err, lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should redirect to the not verified page',
        (done) => {
        chai.request(server)
        .get('/lessons/999')
        .end((err, res) => {
          should.not.exist(err);
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
    describe('POST /lessons', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .post('/lessons')
        .send(testHelpers.lessonRead)
        .end((err, res) => {
          should.not.exist(err);
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
    describe('GET /lessons/:id', () => {
      it('should show a message', (done) => {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then((lesson) => {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            res.text.should.contain('<!-- next lesson button -->');
            res.text.should.contain('<!-- breadcrumbs -->');
            res.text.should.contain('<!-- user messages -->');
            res.text.should.contain('<p class="message-author">Michael Johnson said:</p>');
            res.text.should.contain('Awesome lesson!');
            res.text.should.contain('<!-- reply link -->');
            res.text.should.contain('<!-- deactivate link -->');
            res.text.should.contain('<!-- deactivate reply link -->');
            res.text.should.contain('data-status="hidden"');
            res.text.should.not.contain('data-status="visible"');
            done();
          });
        });
      });
    });
  });

});
