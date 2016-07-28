process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../src/server/db/knex');
var messageQueries = require('../../src/server/db/queries.messages');

var should = chai.should();

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
  describe('getMessages()', function() {
    it('should format data correctly', function(done) {
      messageQueries.getMessages()
      .then(function(results) {
        results.length.should.equal(5);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[1].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[2].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[3].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[4].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
      });
      done();
    });
  });
  describe('getMessagesFromLessonID(1)', function() {
    it('should format data correctly', function(done) {
      messageQueries.getMessagesFromLessonID(1)
      .then(function(results) {
        results.length.should.equal(4);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[1].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[2].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[3].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
      });
      done();
    });
  });
  describe('messagesAndUsers()', function() {
    it('should format data correctly', function(done) {
      messageQueries.messagesAndUsers(1)
      .then(function(results) {
        var d1;
        var d2;
        if (results[0].messageContent === 'Awesome lesson!') {
          d1 = Date.parse(results[0].messageCreatedAt);
          d2 = Date.parse(results[1].messageCreatedAt);
        } else {
          d1 = Date.parse(results[1].messageCreatedAt);
          d2 = Date.parse(results[0].messageCreatedAt);
        }
        var test = d1 >= d2;
        test.should.be.true; // jshint ignore:line
      });
      done();
    });
  });

});
