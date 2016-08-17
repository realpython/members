process.env.NODE_ENV = 'test';

var chai = require('chai');
var Promise = require('es6-promise').Promise;

var knex = require('../../server/db/knex');
var authHelpers = require('../../server/auth/helpers');
var userQueries = require('../../server/db/queries.users.js');
var userAndLessonQueries = require('../../server/db/queries.users_lessons');

var should = chai.should();

describe('auth : helpers', function() {

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

  describe('ensureAuthenticated()', function() {
    it('should return a 403 when the user id is incorrect', function(done) {
      var dummyRequestObject = {
        user: {
          id: 20,
          verified: true
        }
      };
      var dummyResponseObject = {};
      dummyResponseObject.status = function status(code) {
        this.statusCode = code;
        return this;
      };
      dummyResponseObject.json = function json(obj) {
        return obj;
      };
      authHelpers.ensureAuthenticated(dummyRequestObject, dummyResponseObject)
      .then(function(results) {
        results.statusCode.should.equal(403);
        done();
      });
    });
  });

  describe('ensureVerified()', function() {
    it('should return a 403 when the user id is incorrect', function(done) {
      var dummyRequestObject = {
        user: {
          id: 20,
          verified: true
        }
      };
      var dummyResponseObject = {};
      dummyResponseObject.status = function status(code) {
        this.statusCode = code;
        return this;
      };
      dummyResponseObject.json = function json(obj) {
        return obj;
      };
      authHelpers.ensureVerified(dummyRequestObject, dummyResponseObject)
      .then(function(results) {
        results.statusCode.should.equal(403);
        done();
      });
    });
  });

  describe('ensureAdmin()', function() {
    it('should return a 403 when the user id is incorrect', function(done) {
      var dummyRequestObject = {
        user: {
          id: 20,
          verified: true,
          admin: true
        }
      };
      var dummyResponseObject = {};
      dummyResponseObject.status = function status(code) {
        this.statusCode = code;
        return this;
      };
      dummyResponseObject.json = function json(obj) {
        return obj;
      };
      authHelpers.ensureAdmin(dummyRequestObject, dummyResponseObject)
      .then(function(results) {
        results.statusCode.should.equal(403);
        done();
      });
    });
  });

  // TODO: Add test for an existing user (should not add new rows)
  describe('githubCallback()', function() {
    it('should add a user and rows to the users_lessons for a new user',
    function(done) {
      var newUser = {
        accessToken: 123456789,
        refreshToken: undefined,
        profile: {
          id: '123456789',
          _json: {
            email: '123456789@123456789.com',
            avatar_url: 'https://avatars.io/static/default_128.jpg'
          },
          displayName: '123456789',
          username: '123456789'
        },
        done: function verified() {}
      };
      new Promise(function(resolve, reject) {
        authHelpers.githubCallback(
          newUser.accessToken,
          newUser.refreshToken,
          newUser.profile,
          newUser.done
        );
        resolve();
      }).then(function() {
        setTimeout(function() {
          userQueries.getSingleUserByUsername(newUser.profile.displayName)
          .then(function(user) {
            user.length.should.equal(1);
            user[0].github_username.should.equal(newUser.profile.displayName);
            userAndLessonQueries.getUsersAndLessonsByUserID(parseInt(user[0].id))
            .then(function(results) {
              results.length.should.equal(7);
              results[0].user_id.should.equal(parseInt(user[0].id));
              done();
            });
          });
        }, 500);
      });
    });
  });

});
