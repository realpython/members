process.env.NODE_ENV = 'test';

const chai = require('chai');

const knex = require('../../server/db/knex');
const messageQueries = require('../../server/db/queries.messages');

const should = chai.should();

describe('db : queries : messages', () => {

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

  describe('getAllMessages()', () => {
    it('should format data correctly', (done) => {
      messageQueries.getAllMessages()
      .then((results) => {
        results.length.should.equal(6);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[1].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[2].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[3].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[4].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[5].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
      });
      done();
    });
  });
  describe('getMessagesFromLessonID()', () => {
    it('should format data correctly', (done) => {
      messageQueries.getMessagesFromLessonID(1)
      .then((results) => {
        results.length.should.equal(4);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[1].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[2].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[3].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
      });
      done();
    });
  });
  describe('messagesAndUsers()', () => {
    it('should format data correctly', (done) => {
      messageQueries.messagesAndUsers(1, (err, results) => {
        var d1;
        var d2;
        if (results[0].messageContent === 'Awesome lesson!') {
          d1 = Date.parse(results[0].messageCreatedAt);
          d2 = Date.parse(results[1].messageCreatedAt);
        } else {
          d1 = Date.parse(results[1].messageCreatedAt);
          d2 = Date.parse(results[0].messageCreatedAt);
        }
        const test = d1 >= d2;
        test.should.be.true; // jshint ignore:line
      });
      done();
    });
  });
  describe('deleteMessage()', () => {
    it('should delete a single, parent message', (done) => {
      messageQueries.getActiveParentMessages()
      .then((parentMessages) => {
        const parentMessageID = parseInt(parentMessages[0].id);
        const parentMessagesLength = parseInt(parentMessages.length);
        messageQueries.deleteMessage(parentMessageID)
        .then((results) => {
          messageQueries.getActiveParentMessages()
          .then((messages) => {
            const test = (parentMessagesLength - 1) === parseInt(messages.length);
            test.should.be.true; // jshint ignore:line
          });
          done();
        });
      });
    });
  });
  describe('deleteChildMessagesFromParent()', () => {
    it('should delete all child messages', (done) => {
      messageQueries.getActiveChildMessages()
      .then((childMessages) => {
        const parentMessageID = parseInt(childMessages[0].parent_id);
        const parentMessagesLength = parseInt(childMessages.length);
        messageQueries.deleteChildMessagesFromParent(parentMessageID)
        .then((numberOfDeleted) => {
          const firstTest = parentMessagesLength === parseInt(numberOfDeleted);
          firstTest.should.be.true; // jshint ignore:line
          messageQueries.getActiveChildMessages()
          .then((messages) => {
            (messages.length).should.eq(0);
            done();
          });
        });
      });
    });
  });
  describe('deactivateMessage()', () => {
    it('should deactivate a single, parent message', (done) => {
      messageQueries.getActiveParentMessages()
      .then((parentMessages) => {
        const parentMessageID = parseInt(parentMessages[0].id);
        const parentMessagesLength = parseInt(parentMessages.length);
        messageQueries.deactivateMessage(parentMessageID)
        .then((results) => {
          messageQueries.getActiveParentMessages()
          .then((messages) => {
            const test = (parentMessagesLength - 1) === parseInt(messages.length);
            test.should.be.true; // jshint ignore:line
          });
          done();
        });
      });
    });
  });
  describe('deactivateChildMessagesFromParent()', () => {
    it('should deactivate all child messages', (done) => {
      messageQueries.getActiveChildMessages()
      .then((childMessages) => {
        const parentMessageID = parseInt(childMessages[0].parent_id);
        const parentMessagesLength = parseInt(childMessages.length);
        messageQueries.deactivateChildMessagesFromParent(parentMessageID)
        .then((numberOfDectivated) => {
          const firstTest = parentMessagesLength === parseInt(numberOfDectivated);
          firstTest.should.be.true; // jshint ignore:line
          messageQueries.getActiveChildMessages()
          .then((messages) => {
            (messages.length).should.eq(0);
            done();
          });
        });
      });
    });
  });
  describe('getInactiveMessages()', () => {
    it('should format data correctly', (done) => {
      messageQueries.getInactiveMessages((err, results) => {
        results.length.should.equal(1);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
      });
      done();
    });
  });
  describe('getActiveMessages()', () => {
    it('should format data correctly', (done) => {
      messageQueries.getActiveMessages((err, results) => {
        results.length.should.equal(5);
        results[0].active.should.eql(true);
        results[0].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[1].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[2].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[3].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
        results[4].should.include.keys('id', 'content', 'parent_id', 'lesson_id', 'user_id', 'created_at', 'updated_at', 'active');
      });
      done();
    });
  });

});
