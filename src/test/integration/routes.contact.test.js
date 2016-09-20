process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/connection');
const server = require('../../server/app');
const chapterQueries = require('../../server/db/queries.chapters');
const lessonQueries = require('../../server/db/queries.lessons');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : contact', () => {

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
    describe('GET /contact', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/contact')
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
    describe('POST /contact', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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
    describe('GET /contact', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/contact')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<a href="mailto:info@realpython.com">info@realpython.com</a>');
          res.text.should.contain('<a href="#" class="dropdown-toggle avatar-link" data-toggle="dropdown"><img class="avatar" src="https://avatars.io/static/default_128.jpg">&nbsp;Fletcher Heisler <b class="caret"></b></a>');
          done();
        });
      });
    });
    describe('POST /contact', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
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
    describe('GET /contact', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/contact')
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
    describe('POST /contact', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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
    describe('GET /contact', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/contact')
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
    describe('POST /contact', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .post('/contact')
        .send({
          subject: 'contacting support',
          message: 'help!'
        })
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
