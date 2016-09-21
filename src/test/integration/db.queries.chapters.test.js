process.env.NODE_ENV = 'test';

const chai = require('chai');

const knex = require('../../server/db/connection');
const chapterQueries = require('../../server/db/queries/chapters');

const should = chai.should();

describe('db : queries : chapters', () => {

  before((done) => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
    .then(() => { done(); });
  });

  after((done) => {
    return knex.migrate.rollback()
    .then(() => { done(); });
  });

  describe('getChapters()', () => {
    it('should return all chapters', (done) => {
      chapterQueries.getChapters((err, chapters) => {
        should.not.exist(err);
        chapters.length.should.equal(4);
        chapters[0].should.include.keys(
          'id', 'order_number', 'name', 'created_at', 'active');
        chapters[1].should.include.keys(
          'id', 'order_number', 'name', 'created_at', 'active');
        chapters[2].should.include.keys(
          'id', 'order_number', 'name', 'created_at', 'active');
        chapters[3].should.include.keys(
          'id', 'order_number', 'name', 'created_at', 'active');
      });
      done();
    });
  });

  describe('getSingleChapterFromID()', () => {
    it('should return a single chapter', (done) => {
      chapterQueries.getSingleChapterFromID(1, (err, chapter) => {
        should.not.exist(err);
        chapter.length.should.equal(1);
        chapter[0].should.include.keys(
          'id', 'order_number', 'name',  'created_at');
      });
      done();
    });
  });

  describe('getSingleChapterFromOrderNum()', () => {
    it('should return a single chapter', (done) => {
      chapterQueries.getSingleChapterFromOrderNum(1, (err, chapter) => {
        should.not.exist(err);
        chapter.length.should.equal(1);
        chapter[0].should.include.keys(
          'id', 'order_number', 'name',  'created_at');
      });
      done();
    });
  });

  describe('chaptersAndLessons()', () => {
    it('should return chapters and lessons', (done) => {
      chapterQueries.getChaptersAndLessons((err, data) => {
        should.not.exist(err);
        data.length.should.equal(6);
        data[0].should.include.keys(
          'lessonID', 'lessonLessonOrder', 'lessonChapterOrder', 'lessonName', 'lessonContent', 'lessonActive', 'chapterID', 'chapterOrder', 'chapterName');
      });
      done();
    });
  });

});
