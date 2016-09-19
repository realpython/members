process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const passportStub = require('passport-stub');

const knex = require('../../server/db/knex');
const server = require('../../server/app');
const chapterQueries = require('../../server/db/queries.chapters');
const testHelpers = require('../_helpers');

const should = chai.should();

passportStub.install(server);
chai.use(chaiHttp);

describe('routes : admin : chapters', () => {

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
    describe('GET /admin/chapters', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/chapters')
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
    describe('GET /admin/chapters/1', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('POST /admin/chapters', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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
    describe('PUT /admin/chapters/1', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters/1/deactivate', () => {
      it('should redirect to log in page', (done) => {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
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

  describe('if authenticated, active, verified',
  () => {
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
    describe('GET /admin/chapters', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/chapters')
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
    describe('GET /admin/chapters/1', () => {
      it('should redirect to the dashboard', (done) => {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('POST /admin/chapters', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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
    describe('PUT /admin/chapters/1', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters/1/deactivate', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
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
    describe('GET /admin/chapters', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/chapters')
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
    describe('GET /admin/chapters/1', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('POST /admin/chapters', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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
    describe('PUT /admin/chapters/1', () => {
      it('should redirect to the inactive page', (done) => {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters/1/deactivate', () => {
      it('should redirect to dashboard', (done) => {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
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
    describe('GET /admin/chapters', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/chapters')
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
    describe('GET /admin/chapters/1', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .get('/admin/chapters/1')
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
    describe('POST /admin/chapters', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
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
    describe('PUT /admin/chapters/1', () => {
      it('should redirect to the not verified page', (done) => {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
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
    describe('GET /admin/chapters', () => {
      it('should return a response', (done) => {
        chai.request(server)
        .get('/admin/chapters')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Chapters</h1>');
          res.text.should.contain('<!-- breadcrumbs -->');
          done();
        });
      });
    });
    describe('GET /admin/chapters/1', () => {
      it('should return a response', (done) => {
        chapterQueries.getSingleChapter(1)
        .then((chapter) => {
          chai.request(server)
          .get('/admin/chapters/1')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.equal(0);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.status.should.equal('success');
            res.body.data.id.should.equal(chapter[0].id);
            res.body.data.name.should.contain(chapter[0].name);
            done();
          });
        });
      });
    });
    describe('GET /admin/chapters/999', () => {
      it('should throw an error if chapter does not exist', (done) => {
        chai.request(server)
        .get('/admin/chapters/999')
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('POST /admin/chapters', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.sampleChapter)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Chapters</h1>');
          done();
        });
      });
    });
    describe('POST /admin/chapters', () => {
      it('should throw an error when duplicate data is used',
      (done) => {
        chai.request(server)
        .post('/admin/chapters')
        .send(testHelpers.duplicateChapter)
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('text/html');
          res.text.should.contain('<p>Something went wrong!</p>');
          done();
        });
      });
    });
    describe('PUT /admin/chapters/1', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .put('/admin/chapters/1')
        .send(testHelpers.updateChapter)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.equal('success');
          res.body.message.should.equal('Chapter updated.');
          done();
        });
      });
    });
    describe('PUT /admin/chapters/999', () => {
      it('should throw an error if the chapter id does not exist',
        (done) => {
        chai.request(server)
        .put('/admin/chapters/999')
        .send(testHelpers.updateChapter)
        .end((err, res) => {
          should.exist(err);
          res.redirects.length.should.equal(0);
          res.status.should.equal(500);
          res.type.should.equal('application/json');
          res.body.message.should.equal('Something went wrong.');
          done();
        });
      });
    });
    describe('GET /admin/chapters/1/deactivate', () => {
      it('should return a 200 response', (done) => {
        chai.request(server)
        .get('/admin/chapters/1/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Chapters</h1>');
          done();
        });
      });
    });
    describe('GET /admin/chapters/999/deactivate', () => {
      it('should redirect to dashboard if the user id does not exist',
        (done) => {
        chai.request(server)
        .get('/admin/chapters/999/deactivate')
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.equal(1);
          res.status.should.equal(200);
          res.type.should.equal('text/html');
          res.text.should.contain('<h1>Dashboard</h1>');
          res.text.should.not.contain(
            '<p><span class="completed">0% Complete</span><span>&nbsp;(0 lessons)</p>');
          res.text.should.contain('<h2>You are an admin.</h2>');
          done();
        });
      });
    });
  });

});
