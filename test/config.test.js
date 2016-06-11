process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var knex = require('../src/server/db/knex');
var server = require('../src/server/app');

var should = chai.should();

chai.use(chaiHttp);

describe('test config', function() {
  var database = knex.queryBuilder().client.config.connection.database;
  it('should return correct test configurations', function(done) {
    database.should.equal('textbook_test');
    database.should.not.equal('textbook');
    done();
  });
});