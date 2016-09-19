process.env.NODE_ENV = 'test';

const chai = require('chai');

const knex = require('../../server/db/knex');
const chapterQueries = require('../../server/db/queries.chapters');

const should = chai.should();

describe('db : queries : chapters', () => {

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

  describe('getChapters()', () => {
    it('should format data correctly', (done) => {
      chapterQueries.getChapters((err, results) => {
        results.length.should.equal(4);
        results[0].should.include.keys('id', 'order_number', 'name', 'created_at', 'active');
        results[1].should.include.keys('id', 'order_number', 'name', 'created_at', 'active');
        results[2].should.include.keys('id', 'order_number', 'name', 'created_at', 'active');
        results[3].should.include.keys('id', 'order_number', 'name', 'created_at', 'active');
      });
      done();
    });
  });
  describe('getSingleChapter()', () => {
    it('should format data correctly', (done) => {
      chapterQueries.getSingleChapter(1)
      .then((results) => {
        results.length.should.equal(1);
        results[0].should.include.keys('id', 'order_number', 'name',  'created_at');
      });
      done();
    });
  });

});
