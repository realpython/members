process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');
var lessonQueries = require('../../src/server/db/queries.lessons');

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
    describe('GET /lessons/:id/update?read=true', function() {
      it('should redirect to log in page', function(done) {
        chai.request(server)
        .get('/lessons/1/update?read=true')
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
          // var previous = parseInt(lesson[0].id) - 1;
          // var next = parseInt(lesson[0].id) + 1;
          chai.request(server)
          .get('/lessons/' + lesson[0].id)
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain(
              '<h1>' + lesson[0].name + '</h1>');
            // res.text.should.contain('<!-- previous lesson button -->');
            // res.text.should.contain('<!-- next lesson button -->');
            done();
          });
        });
      });
    });
    // describe('GET /chapters/:id', function() {
    //   it('should show only next chapter button', function(done) {
    //     chapterQueries.getSingleChapterFromOrder(1)
    //     .then(function(chapter) {
    //       var previous = parseInt(chapter[0].id) - 1;
    //       var next = parseInt(chapter[0].id) + 1;
    //       chai.request(server)
    //       .get('/chapters/' + chapter[0].id)
    //       .end(function(err, res) {
    //         res.redirects.length.should.equal(0);
    //         res.status.should.equal(200);
    //         res.type.should.equal('text/html');
    //         res.text.should.contain(
    //           '<h1>' + chapter[0].name + '</h1>');
    //         res.text.should.not.contain('<!-- previous chapter button -->');
    //         res.text.should.contain('<!-- next chapter button -->');
    //         done();
    //       });
    //     });
    //   });
    // });
    // describe('GET /chapters/:id', function() {
    //   it('should show only previous chapter button', function(done) {
    //     chapterQueries.getSingleChapterFromOrder(3)
    //     .then(function(chapter) {
    //       var previous = parseInt(chapter[0].id) - 1;
    //       var next = parseInt(chapter[0].id) + 1;
    //       chai.request(server)
    //       .get('/chapters/' + chapter[0].id)
    //       .end(function(err, res) {
    //         res.redirects.length.should.equal(0);
    //         res.status.should.equal(200);
    //         res.type.should.equal('text/html');
    //         res.text.should.contain(
    //           '<h1>' + chapter[0].name + '</h1>');
    //         res.text.should.contain('<!-- previous chapter button -->');
    //         res.text.should.not.contain('<!-- next chapter button -->');
    //         done();
    //       });
    //     });
    //   });
    // });
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
    describe('GET /lessons/:id/update?read=true', function() {
      it('should redirect to the dashboard', function(done) {
        lessonQueries.getLessons()
        .then(function(lessons) {
          chai.request(server)
          .get('/lessons/' + lessons[0].id + '/update?read=true')
          .end(function(err, res) {
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('<span class="badge"><i class="fa fa-check" aria-hidden="true"></i></span>');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id/update?read=999', function() {
      it('should throw an error if the query string "read" is not a boolean', function(done) {
        lessonQueries.getLessons()
        .then(function(lessons) {
          chai.request(server)
          .get('/lessons/' + lessons[0].id + '/update?read=999')
          .end(function(err, res) {
            res.redirects.length.should.equal(0);
            res.status.should.equal(500);
            res.type.should.equal('text/html');
            done();
          });
        });
      });
    });
    describe('GET /lessons/:id/update?test=true', function() {
      it('should throw an error if the query string is not "read"', function(done) {
        lessonQueries.getLessons()
        .then(function(lessons) {
          chai.request(server)
          .get('/lessons/' + lessons[0].id + '/update?test=true')
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
