process.env.NODE_ENV = 'test';

const chai = require('chai');

const knex = require('../../server/db/connection');
const lessonQueries = require('../../server/db/queries/lessons');

const should = chai.should();

describe('db : queries : lessons', () => {

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

  describe('getAllLessons()', () => {
    it('should return all lessons', (done) => {
      lessonQueries.getAllLessons((err, lessons) => {
        should.not.exist(err);
        lessons.length.should.equal(7);
        lessons[0].should.include.keys(
          'id', 'lesson_order_number', 'chapter_order_number',
          'content', 'active', 'chapter_id', 'created_at');
        lessons[6].should.include.keys(
          'id', 'lesson_order_number', 'chapter_order_number',
          'content', 'active', 'chapter_id', 'created_at');
        done();
      });
    });
  });

  describe('getActiveLessons()', () => {
    it('should return all active lessons', (done) => {
      lessonQueries.getActiveLessons((err, lessons) => {
        should.not.exist(err);
        lessons.length.should.equal(6);
        lessons[0].should.include.keys(
          'id', 'lesson_order_number', 'chapter_order_number',
          'content', 'active', 'chapter_id', 'created_at');
        lessons[0].active.should.eql(true);
        lessons[5].should.include.keys(
          'id', 'lesson_order_number', 'chapter_order_number',
          'content', 'active', 'chapter_id', 'created_at');
        done();
      });
    });
  });

  describe('getInactiveLessons()', () => {
    it('should format data correctly', (done) => {
      lessonQueries.getInactiveLessons()
      .then((results) => {
        results.length.should.equal(1);
        results[0].should.include.keys('id', 'lesson_order_number', 'chapter_order_number', 'content', 'active', 'chapter_id', 'created_at');
        done();
      });
    });
  });

  describe('getLessonsFromChapterID(1)', () => {
    it('should format data correctly', (done) => {
      lessonQueries.getLessonsFromChapterID(1)
      .then((results) => {
        results[0].should.include.keys('id', 'lesson_order_number', 'chapter_order_number', 'name', 'content', 'active', 'chapter_id', 'created_at');
      });
      done();
    });
  });

});
