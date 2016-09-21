process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/connection');
const server = require('../../server/app');
const testHelpers = require('../_helpers');
const userQueries = require('../../server/db/queries/users');
const codeQueries = require('../../server/db/queries/codes');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : auth', () => {

  beforeEach((done) => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
    .then(() => { done(); });
  });

  afterEach((done) => {
    return knex.migrate.rollback()
    .then(() => { done(); });
  });

  describe('if !authenticated', () => {
    describe('GET /auth/log_out', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/log_out')
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
    describe('GET /auth/log_in', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/log_in')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('try Textbook');
          done();
        });
      });
    });
    describe('POST /auth/verify', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 21049144460970398511
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
    describe('GET /auth/inactive', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/inactive')
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
    describe('GET /auth/verify', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/verify')
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
    describe('GET /auth/log_out', () => {
      it('should log out and redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/log_out')
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
    describe('GET /auth/log_in', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/auth/log_in')
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
    describe('POST /auth/verify', () => {
      it('should throw an error', (done) => {
        codeQueries.getUnunsedCodes()
        .then((codes) => {
          chai.request(server)
          .post('/auth/verify')
          .send({
            code: codes[0].verify_code
          })
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1');
            res.text.should.not.contain(
              '<h2>Your account is inactive.</h2>');
            done();
          });
        });
      });
    });
    describe('POST /auth/verify', () => {
      it('should redirect to the inactive page if the code is incorrect', (done) => {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 999
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain('<h1>Dashboard</h1>');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          done();
        });
      });
    });
    describe('POST /auth/verify', () => {
      it('should redirect to the closed page if verification status is 0', (done) => {
        process.env.CAN_VERIFY = 0;
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 999
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>We are closed.</h2>');
          res.text.should.not.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          process.env.CAN_VERIFY = 1;
          done();
        });
      });
    });
    describe('GET /auth/inactive', () => {
      it('should log out and redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/inactive')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /auth/verify', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/auth/verify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/verify', () => {
      it('should redirect to the closed page if verification status is 0',
      (done) => {
        process.env.CAN_VERIFY = 0;
        chai.request(server)
        .get('/auth/verify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>We are closed.</h2>');
          res.text.should.not.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          process.env.CAN_VERIFY = 1;
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
    describe('GET /auth/log_out', () => {
      it('should log out and redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/log_out')
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
    describe('GET /auth/log_in', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/auth/log_in')
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
    describe('POST /auth/verify', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .post('/auth/verify')
        .send({
          code: 21049144460970398511
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
    describe('GET /auth/inactive', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/auth/inactive')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h2>Your account is inactive.</h2>');
          res.text.should.contain('<p>Please contact support.</p>');
          done();
        });
      });
    });
    describe('GET /auth/verify', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/auth/verify')
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
    describe('GET /auth/log_out', () => {
      it('should log out and redirect to log in page', (done) => {
        chai.request(server)
        .get('/auth/log_out')
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
    describe('GET /auth/log_in', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/auth/log_in')
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
    describe('POST /auth/verify', () => {
      it('should verify and then redirect to /', (done) => {
        codeQueries.getUnunsedCodes()
        .then((codes) => {
          chai.request(server)
          .post('/auth/verify')
          .send({
            code: codes[0].verify_code
          })
          .end(() => {
            chai.request(server)
            .get('/auth/log_out')
            .end(() => {
              userQueries.getSingleUserByUsername('fletcher', (err, user) => {
                passportStub.login(user[0]);
                chai.request(server)
                .get('/')
                .end((err, res) => {
                  should.not.exist(err);
                  res.redirects.length.should.equal(0);
                  res.status.should.equal(200);
                  res.type.should.equal('text/html');
                  res.text.should.contain('<h1>Dashboard</h1>');
                  res.text.should.not.contain(
                    '<h2>Please verify your account.</h2>');
                  res.text.should.not.contain(
                    '<h2>Your account is inactive.</h2>');
                  done();
                });
              });
            });
          });
        });
      });
    });
    describe('POST /auth/verify', () => {
      beforeEach((done) => {
        const permissions = {
          verified: false,
          admin: false,
          active: true
        };
        testHelpers.authenticateDuplicate(permissions, done);
      });
      afterEach((done) => {
        passportStub.logout();
        done();
      });
      it('should throw an error if a duplicate verify code is used with a different user', (done) => {
        codeQueries.getUnunsedCodes()
        .then((codes) => {
          chai.request(server)
          .post('/auth/verify')
          .send({
            code: codes[0].verify_code
          })
          .end(() => {
            passportStub.logout();
            userQueries.getSingleUserByUsername('fletcher', (err, user) => {
              passportStub.login(user[0]);
              chai.request(server)
              .post('/auth/verify')
              .send({
                code: codes[0].verify_code
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
                res.text.should.not.contain('try Textbook');
                res.text.should.not.contain('<h1>Dashboard</h1>');
                userQueries.getSingleUserByUsername(
                  'jeremy', (err, newUser) => {
                  newUser[0].verified.should.equal(false);
                  should.not.exist(newUser[0].verify_code);
                  done();
                });
              });
            });
          });
        });
      });
    });
    describe('POST /auth/verify', () => {
      beforeEach((done) => {
        const permissions = {
          verified: false,
          admin: false,
          active: true
        };
        testHelpers.authenticateDuplicate(permissions, done);
      });
      afterEach((done) => {
        passportStub.logout();
        done();
      });
      it('should throw an error if a duplicate verify code is used with the same user', (done) => {
        codeQueries.getUnunsedCodes()
        .then((codes) => {
          chai.request(server)
          .post('/auth/verify')
          .send({
            code: codes[0].verify_code
          })
          .end(() => {
            passportStub.logout();
            userQueries.getSingleUserByUsername('jeremy', (err, user) => {
              passportStub.login(user[0]);
              chai.request(server)
              .post('/auth/verify')
              .send({
                code: codes[0].verify_code
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
                res.text.should.not.contain('try Textbook');
                res.text.should.not.contain('<h1>Dashboard</h1>');
                userQueries.getSingleUserByUsername(
                'jeremy', (err, newUser) => {
                  newUser[0].verified.should.equal(false);
                  should.not.exist(newUser[0].verify_code);
                  done();
                });
              });
            });
          });
        });
      });
    });
    describe('POST /auth/verify', () => {
      it('should throw an error if an incorrect code is used', (done) => {
        codeQueries.getUnunsedCodes()
        .then((codes) => {
          chai.request(server)
          .post('/auth/verify')
          .send({
            code: 999
          })
          .end(() => {
            chai.request(server)
            .get('/auth/log_out')
            .end(() => {
              userQueries.getSingleUserByUsername('fletcher', (err, user) => {
                passportStub.login(user[0]);
                chai.request(server)
                .get('/')
                .end((err, res) => {
                  should.not.exist(err);
                  res.redirects.length.should.equal(1);
                  res.status.should.equal(200);
                  res.type.should.equal('text/html');
                  res.text.should.not.contain('<h1>Dashboard</h1>');
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
      });
    });
    describe('GET /auth/inactive', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/auth/inactive')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          done();
        });
      });
    });
    describe('GET /auth/verify', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/auth/verify')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain(
            '<h2>Please verify your account.</h2>');
          res.text.should.not.contain(
            '<h2>Your account is inactive.</h2>');
          res.text.should.not.contain('try Textbook');
          done();
        });
      });
    });
  });

});
