process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/knex');
const server = require('../../server/app');
const messageQueries = require('../../server/db/queries.messages');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : messages', () => {

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
    describe('GET /admin/messages/:id/deactivate?type=parent', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
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
    describe('GET /admin/messages/:id/update', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/messages/1/update')
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
    describe('GET /admin/messages/:id/deactivate?type=parent', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
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
    describe('GET /admin/messages/:id/update', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/messages/1/update')
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
    describe('GET /admin/messages/:id/deactivate?type=parent', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
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
    describe('GET /admin/messages/:id/update', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/messages/1/update')
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
    describe('GET /admin/messages/:id/deactivate?type=parent', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/messages/1/deactivate?type=parent')
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
    describe('GET /admin/messages/:id/update', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/messages/1/update')
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
    describe('GET /admin/messages/:id/deactivate?type=parent', () => {
      it('should deactivate parent and child messages', (done) => {
        messageQueries.getActiveParentMessages()
        .then((messages) => {
          chai.request(server)
          .get('/admin/messages/' + messages[0].id + '/deactivate?type=parent')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('<h2>You are an admin.</h2>');
            done();
          });
        });
      });
    });
    describe('GET /admin/messages/:id/deactivate?type=child', () => {
      it('should deactivate child messages', (done) => {
        messageQueries.getActiveChildMessages()
        .then((messages) => {
          chai.request(server)
          .get('/admin/messages/' + messages[0].id + '/deactivate?type=parent')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
            res.status.should.equal(200);
            res.type.should.equal('text/html');
            res.text.should.contain('<h1>Dashboard</h1>');
            res.text.should.contain('<h2>You are an admin.</h2>');
            done();
          });
        });
      });
    });
    describe('GET /admin/messages/:id/update', () => {
      it('should update messages', (done) => {
        messageQueries.getActiveParentMessages()
        .then((messages) => {
          chai.request(server)
          .get('/admin/messages/' + messages[0].id + '/update')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(1);
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

});
