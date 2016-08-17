process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../server/db/knex');
var usersAndlessonsQueries = require('../../server/db/queries.users_lessons');

var should = chai.should();

describe('db : queries : users_lessons', function() {

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

  describe('getAllUsersAndLessons()', function() {
    it('should format data correctly', function(done) {
      usersAndlessonsQueries.getAllUsersAndLessons()
      .then(function(results) {
        results[0].should.include.keys('id', 'user_id', 'lesson_id', 'lesson_read');
        done();
      });
    });
  });

});
