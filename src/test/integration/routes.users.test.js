process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/knex');
const server = require('../../server/app');
const userQueries = require('../../server/db/queries.users');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : users', () => {

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
    describe('PUT /users/:username/admin', () => {
      it('should throw an error if the user does not exist', (done) => {
        chai.request(server)
        .put('/users/fletcher/admin')
        .send({ admin: true })
        .end((err, res) => {
          should.exist(err);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.message.should.equal('That user does not exist.');
          done();
        });
      });
    });
    describe('GET /users/:id/profile', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/users/1/profile')
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
    describe('POST /users/:id/profile', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/users/1/profile')
        .send({
          displayName: 'John Doe'
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
    describe('GET /users/:id/profile', () => {
      it('should return a 200 response', (done) => {
        userQueries.getUsers((err, users) => {
          chai.request(server)
          .get('/users/' + parseInt(users[0].id) + '/profile')
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>User Profile');
            res.text.should.contain('<dt>Email</dt>');
            done();
          });
        });
      });
    });
    describe('PUT /users/:username/admin', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .put('/users/fletcher/admin')
        .send({ admin: true })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.equal('User admin status updated.');
          done();
        });
      });
    });
    describe('PUT /users/:username/admin', () => {
      it('should throw an error if the user does not exist', (done) => {
        chai.request(server)
        .put('/users/michael/admin')
        .send({ admin: true })
        .end((err, res) => {
          should.exist(err);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.message.should.equal('That user does not exist.');
          done();
        });
      });
    });
    describe('PUT /users/:username/admin', () => {
      it('should throw an error if "read" is not in the request body', (done) => {
        chai.request(server)
        .put('/users/fletcher/admin')
        .send({ unknown: true })
        .end((err, res) => {
          should.exist(err);
          res.status.should.equal(403);
          res.type.should.equal('application/json');
          res.body.message.should.equal(
            'You do not have permission to do that.');
          done();
        });
      });
    });
    describe('PUT /users/:username/active', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .put('/users/fletcher/active')
        .send({ active: true })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.equal('User active status updated.');
          done();
        });
      });
    });
    describe('POST /users/:id/profile', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .post('/users/1/profile')
        .send({
          displayName: 'John Doe'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>User Profile');
          res.text.should.contain('<dt>Email</dt>');
          res.text.should.contain('<dd>John Doe</dd>');
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
    describe('GET /users/:id/profile', () => {
      it('should redirect to the inactive page', (done) => {
        userQueries.getUsers((err, users) => {
          chai.request(server)
          .get('/users/' + parseInt(users[0].id) + '/profile')
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
    describe('POST /users/:id/profile', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .post('/users/1/profile')
        .send({
          displayName: 'John Doe'
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
    describe('GET /users/:id/profile', () => {
      it('should redirect to the not verified page', (done) => {
        userQueries.getUsers((err, users) => {
          chai.request(server)
          .get('/users/' + parseInt(users[0].id) + '/profile')
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
    describe('POST /users/:id/profile', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .post('/users/1/profile')
        .send({
          displayName: 'John Doe'
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
