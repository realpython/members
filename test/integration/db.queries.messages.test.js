process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../src/server/db/knex');
var messageQueries = require('../../src/server/db/queries.messages');

chai.use(require('chai-datetime'));

describe('db : queries : messages', function() {

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

  describe('reducedResults()', function() {
    it('should format data correctly', function(done) {
      messageQueries.messagesAndUsers(1)
      .then(function(results) {
        var d1 = results[0].messageCreatedAt;
        var d2 = results[1].messageCreatedAt;
        d1.should.beforeTime(d2);
      });
      done();
    });
  });

});
