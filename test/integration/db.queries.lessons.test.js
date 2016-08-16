process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../src/server/db/knex');
var lessonQueries = require('../../src/server/db/queries.lessons');

var should = chai.should();

describe('db : queries : lessons', function() {

  beforeEach(function(done) {
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

  describe('getInactiveLessons()', function() {
    it('should format data correctly', function(done) {
      lessonQueries.getInactiveLessons()
      .then(function(results) {
        results.length.should.equal(1);
        results[0].should.include.keys('id', 'lesson_order_number', 'chapter_order_number', 'content', 'active', 'chapter_id', 'created_at');
        done();
      });
    });
  });

  describe('getLessonsFromChapterID(1)', function() {
    it('should format data correctly', function(done) {
      lessonQueries.getLessonsFromChapterID(1)
      .then(function(results) {
        results[0].should.include.keys('id', 'lesson_order_number', 'chapter_order_number', 'name', 'content', 'active', 'chapter_id', 'created_at');
      });
      done();
    });
  });

});
