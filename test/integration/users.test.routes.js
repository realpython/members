process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var passportStub = require('passport-stub');

var knex = require('../../src/server/db/knex');
var testHelpers = require('../helpers');
var server = require('../../src/server/app');
var chapterQueries = require('../../src/server/db/queries.chapters');

var should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : users', function() {

  beforeEach(function(done) {
    passportStub.logout();
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

  describe('if user does not exist', function() {
    describe('PUT /:username/admin', function() {
      it('should throw an error', function(done) {
        chai.request(server)
        .put('/users/michael/admin')
        .send({ admin: true })
        .end(function(err, res) {
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.message.should.equal('That user does not exist.');
          done();
        });
      });
    });
  });

  describe('if user does exist', function() {
    beforeEach(function(done) {
      testHelpers.authenticateUser(done);
    });
    afterEach(function(done) {
      passportStub.logout();
      done();
    });
    describe('PUT /:username/admin', function() {
      it('should return a 200 response', function(done) {
        chai.request(server)
        .put('/users/michael/admin')
        .send({ admin: true })
        .end(function(err, res) {
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.equal('User admin status updated.');
          done();
        });
      });
    });
    describe('PUT /:username/admin', function() {
      it('should throw an error if "read" is not in the request body', function(done) {
        chai.request(server)
        .put('/users/michael/admin')
        .send({ unknown: true })
        .end(function(err, res) {
          res.status.should.equal(403);
          res.type.should.equal('application/json');
          res.body.message.should.equal(
            'You do not have permission to do that.');
          done();
        });
      });
    });
  });

});
