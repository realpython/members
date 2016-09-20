process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');
const path = require('path');
const fs = require('fs');

const knex = require('../../server/db/connection');
const server = require('../../server/app');
const chapterQueries = require('../../server/db/queries.chapters');
const lessonQueries = require('../../server/db/queries.lessons');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : index', () => {

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

  describe('if !authenticated', () => {
    describe('GET /ping', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/ping')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.equal('pong!');
          done();
        });
      });
    });
    describe('GET /', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /doesnotexist', () => {
      it('should throw an error', (done) => {
        chai.request(server)
        .get('/doesnotexist')
        .end((err, res) => {
          should.exist(err);
          res.status.should.equal(404);
          res.type.should.equal('text/html');
          res.text.should.contain('<p>Sorry. That page cannot be found.</p>');
          done();
        });
      });
    });
  });

  describe('if authenticated, active, and verified', () => {
    beforeEach((done) => {
      const permissions = {
        verified: true,
        admin: false,
        active: true
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain('<ul id="sidebar-chapter-1" class="lesson-list');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.contain('<a href="#" class="dropdown-toggle avatar-link" data-toggle="dropdown"><img class="avatar" src="https://avatars.io/static/default_128.jpg">&nbsp;Fletcher Heisler <b class="caret"></b></a>');
          res.text.should.contain('<!-- course status -->');
          res.text.should.contain('<!-- course stats -->');
          res.text.should.contain('<!-- activity feed: comments -->');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          // no lessons are read
          res.text.should.not.contain('data-lesson-read="true"');
          res.text.should.not.contain('Inactive Chapter');
          done();
        });
      });
    });
  });

  describe('if authenticated, !active, verified', () => {
    beforeEach((done) => {
      const permissions = {
        verified: true,
        admin: false,
        active: false
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.not.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
  });

  describe('if authenticated, active, !verified', () => {
    beforeEach((done) => {
      const permissions = {
        verified: false,
        admin: false,
        active: true
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
  });

  describe('if admin', () => {
    beforeEach((done) => {
      const permissions = {
        verified: true,
        admin: true,
        active: true
      };
      testHelpers.authenticate(permissions, done);
    });
    afterEach((done) => {
      passportStub.logout();
      done();
    });
    describe('GET /', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
  });

});
