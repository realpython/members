process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('../../src/server/app');

chai.use(chaiHttp);

describe('routes : index', function() {

  describe('GET /ping', function() {
    it('should return a response', function(done) {
      chai.request(server)
      .get('/ping')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        res.text.should.equal('pong!');
        done();
      });
    });
  });

  describe('GET /', function() {
    it('should return a response', function(done) {
      chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        done();
      });
    });
  });

});