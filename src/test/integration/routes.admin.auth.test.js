process.env.NODE_ENV = 'test';
process.env.CAN_VERIFY = 1;

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/connection');
const server = require('../../server/app');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : auth', () => {

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
    describe('GET /admin/auth/verification', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/auth/verification')
        .end((err, res) => {
          should.not.exist(err);
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
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

  describe('if authenticated, active, verified', () => {
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
    describe('GET /admin/auth/verification', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/auth/verification')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.not.contain('<h2>You are an admin.</h2>');
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
    describe('GET /admin/auth/verification', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/auth/verification')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('GET /admin/auth/verification', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/auth/verification')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('GET /admin/auth/verification/toggle', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(2);
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
    describe('GET /admin/auth/verification', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/auth/verification')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.verified.should.equal(true);
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          res.text.should.contain('Verification status:');
          process.env.CAN_VERIFY = 1;
          done();
        });
      });
    });
    describe('GET /admin/auth/verification/toggle', () => {
      it('should update the verification status on the dashboard',
      (done) => {
        chai.request(server)
        .get('/admin/auth/verification/toggle')
        .end((err, res) => {
          should.not.exist(err);
          chai.request(server)
          .get('/admin/auth/verification')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('success');
            res.body.verified.should.equal(false);
            process.env.CAN_VERIFY = 1;
            done();
          });
        });
      });
    });
    describe('GET /admin/auth/verification', () => {
      it('should return a response',
      (done) => {
        chai.request(server)
        .get('/admin/auth/verification')
        .end((err, res) => {
          should.not.exist(err);
          chai.request(server)
          .get('/admin/auth/verification')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('success');
            res.body.verified.should.equal(true);
            process.env.CAN_VERIFY = 1;
            done();
          });
        });
      });
    });
  });

});
