process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../src/server/db/knex');
var chapterQueries = require('../../src/server/db/queries.chapters');

var should = chai.should();

describe('db : queries : chapters', function() {

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

  describe('getChapters()', function() {
    it('should format data correctly', function(done) {
      chapterQueries.getChapters()
      .then(function(results) {
        results.length.should.equal(3);
        results[0].should.include.keys('id', 'order_number', 'name', 'read', 'created_at');
        results[1].should.include.keys('id', 'order_number', 'name', 'read', 'created_at');
        results[2].should.include.keys('id', 'order_number', 'name', 'read', 'created_at');
      });
      done();
    });
  });
  describe('getSingleChapter(1)', function() {
    it('should format data correctly', function(done) {
      chapterQueries.getSingleChapter(1)
      .then(function(results) {
        results.length.should.equal(1);
        results[0].should.include.keys('id', 'order_number', 'name', 'read', 'created_at');
      });
      done();
    });
  });

});
