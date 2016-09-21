process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../server/db/connection');
var usersLessonsQueries = require('../../server/db/queries/users_lessons');

var should = chai.should();

describe('db : queries : users_lessons', function() {

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

  describe('getAllUsersAndLessons()', function() {
    it('should format data correctly', function(done) {
      usersLessonsQueries.getAllUsersAndLessons((err, results) => {
        results[0].should.include.keys('id', 'user_id', 'lesson_id', 'lesson_read');
        done();
      });
    });
  });

});
