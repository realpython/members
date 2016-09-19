process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/knex');
const server = require('../../server/app');
const lessonQueries = require('../../server/db/queries.lessons');
const chapterQueries = require('../../server/db/queries.chapters');
const messageQueries = require('../../server/db/queries.messages');
const testHelpers = require('../helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : search', () => {

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
    describe('GET /search?term=deep', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/search?term=deep')
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
    // describe('GET /search?term=deep', () => {
    //   it('should return a response and show results', (done) => {
    //     chai.request(server)
    //     .get('/search?term=deep')
    //     .end((err, res) => {
    //       should.not.exist(err);
    //       res.redirects.length.should.equal(0);
    //       res.status.should.equal(200);
    //       res.type.should.equal('text/html');
    //       res.text.should.contain('<h1>Search</h1>');
    //       res.results.length.should.equal(3);
    //       done();
    //     });
    //   });
    // });
    // describe('GET /search?term=', () => {
    //   it('should return a response and show results', (done) => {
    //     chai.request(server)
    //     .get('/search?term=')
    //     .end((err, res) => {
    //       should.not.exist(err);
    //       res.redirects.length.should.equal(0);
    //       res.status.should.equal(200);
    //       res.type.should.equal('text/html');
    //       res.text.should.contain('<h1>Search</h1>');
    //       res.text.should.contain('<p>Nothing found.</p>');
    //       done();
    //     });
    //   });
    // });
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
    describe('GET /search?term=deep', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/search?term=deep')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
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
    describe('GET /search?term=deep', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/search?term=deep')
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

});
