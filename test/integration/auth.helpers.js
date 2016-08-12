process.env.NODE_ENV = 'test';

var chai = require('chai');

var knex = require('../../src/server/db/knex');
var authHelpers = require('../../src/server/auth/helpers');

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

});
