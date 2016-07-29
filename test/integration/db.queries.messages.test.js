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
  describe('getAllMessages()', function() {
    it('should format data correctly', function(done) {
      messageQueries.getAllMessages()
      .then(function(results) {
        results.length.should.equal(6);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[1].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[2].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[3].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[4].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
        results[5].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at');
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
  describe('deleteMessage()', function() {
    it('should delete a single, parent message', function(done) {
      messageQueries.getActiveParentMessages()
      .then(function(parentMessages) {
        var parentMessageID = parseInt(parentMessages[0].id);
        var parentMessagesLength = parseInt(parentMessages.length);
        messageQueries.deleteMessage(parentMessageID)
        .then(function(results) {
          messageQueries.getActiveParentMessages()
          .then(function(messages) {
            var test = (parentMessagesLength - 1) === parseInt(messages.length);
            test.should.be.true; // jshint ignore:line
          });
          done();
        });
      });
    });
  });
  describe('deleteChildMessagesFromParent()', function() {
    it('should delete all child messages', function(done) {
      messageQueries.getActiveChildMessages()
      .then(function(childMessages) {
        var parentMessageID = parseInt(childMessages[0].parent_id);
        var parentMessagesLength = parseInt(childMessages.length);
        messageQueries.deleteChildMessagesFromParent(parentMessageID)
        .then(function(numberOfDeleted) {
          var firstTest = parentMessagesLength === parseInt(numberOfDeleted);
          firstTest.should.be.true; // jshint ignore:line
          messageQueries.getActiveChildMessages()
          .then(function(messages) {
            (messages.length).should.eq(0);
            done();
          });
        });
      });
    });
  });
  describe('deactivateMessage()', function() {
    it('should deactivate a single, parent message', function(done) {
      messageQueries.getActiveParentMessages()
      .then(function(parentMessages) {
        var parentMessageID = parseInt(parentMessages[0].id);
        var parentMessagesLength = parseInt(parentMessages.length);
        messageQueries.deactivateMessage(parentMessageID)
        .then(function(results) {
          messageQueries.getActiveParentMessages()
          .then(function(messages) {
            var test = (parentMessagesLength - 1) === parseInt(messages.length);
            test.should.be.true; // jshint ignore:line
          });
          done();
        });
      });
    });
  });
  describe('deactivateChildMessagesFromParent()', function() {
    it('should deactivate all child messages', function(done) {
      messageQueries.getActiveChildMessages()
      .then(function(childMessages) {
        var parentMessageID = parseInt(childMessages[0].parent_id);
        var parentMessagesLength = parseInt(childMessages.length);
        messageQueries.deactivateChildMessagesFromParent(parentMessageID)
        .then(function(numberOfDectivated) {
          var firstTest = parentMessagesLength === parseInt(numberOfDectivated);
          firstTest.should.be.true; // jshint ignore:line
          messageQueries.getActiveChildMessages()
          .then(function(messages) {
            (messages.length).should.eq(0);
            done();
          });
        });
      });
    });
  });

});
