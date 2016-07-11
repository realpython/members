process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');
var lessonQueries = require('../../src/server/db/queries.lessons');
var chapterQueries = require('../../src/server/db/queries.chapters');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : lessons', function() {

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
    describe('GET /lessons/:id', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/lessons/1')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /lessons', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .post('/lessons')
        .send({
          chapter: 1,
          lesson: 1,
          read: 'true'
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

  describe('if authenticated', function() {
    beforeEach(function(done) {
      testHelpers.authenticateUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('GET /lessons/:id', function() {
      it('should return a response', function(done) {
        lessonQueries.getSingleLessonFromOrder(2)
        .then(function(lesson) {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end(function(err, res) {
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
    describe('GET /lessons/1', function() {
      it('should show a message', function(done) {
        lessonQueries.getSingleLessonFromLessonID(1)
        .then(function(lesson) {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end(function(err, res) {
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
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id', function() {
      it('should show only next lesson button', function(done) {
        lessonQueries.getSingleLessonFromOrder(1)
        .then(function(lesson) {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end(function(err, res) {
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
    describe('GET /lessons/:id', function() {
      it('should show only previous lesson button', function(done) {
        lessonQueries.getSingleLessonFromOrder(6)
        .then(function(lesson) {
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end(function(err, res) {
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
    describe('GET /lessons/:id', function() {
      it('should redirect to the dashboard if the lesson is invalid',
        function(done) {
        chai.request(server)
        .get('/lessons/999')
        .end(function(err, res) {
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          done();
        });
      });
    });
    describe('POST /lessons', function() {
      it('should redirect to the dashboard', function(done) {
        lessonQueries.getLessons()
        .then(function(lessons) {
          chai.request(server)
          .post('/lessons')
          .send({
            chapter: lessons[0].chapter_id,
            lesson: lessons[0].id,
            read: 'true'
          })
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('&nbsp;&nbsp;&nbsp;<i class="fa fa-check" data-lesson-read="true"></i></a>');
            done();
          });
        });
      });
    });
    describe('POST /lessons', function() {
      it('should mark chapter as read', function(done) {
        chapterQueries.getSingleChapterFromOrder(2)
        .then(function(chapter) {
          lessonQueries.getLessonsFromChapterID(chapter[0].id)
          .then(function(lessons) {
            chai.request(server)
            .post('/lessons')
            .send({
              chapter: lessons[0].chapter_id,
              lesson: lessons[0].id,
              read: 'true'
            })
            .end(function(err, res) {
              res.redirects.length.should.equal(1);
              res.status.should.equal(200);
              res.type.should.equal('text/html');
              res.text.should.contain('<h1>Dashboard</h1>');
              res.text.should.contain('&nbsp;&nbsp;&nbsp;<i class="fa fa-check" data-lesson-read="true"></i></a>');
              res.text.should.contain('&nbsp;&nbsp;&nbsp;<i class="fa fa-check" data-chapter-read="true"></i></a>');
              done();
            });
          });
        });
      });
    });
    describe('POST /lessons', function() {
      it('should throw an error if the query string "read" is not a boolean', function(done) {
        lessonQueries.getLessons()
        .then(function(lessons) {
          chai.request(server)
          .post('/lessons')
          .send({
            chapter: lessons[0].chapter_id,
            lesson: lessons[0].id,
            read: '999'
          })
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
