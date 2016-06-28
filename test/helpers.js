var passportStub = require('passport-stub');
var queries = require('../src/server/db/queries.users');

function authenticateUser(done) {
  queries.addUser({
    username: 'michael',
    github_id: 123456,
    display_name: 'Michael Herman',
    email: 'michael@realpython.com',
    access_token: '123456',
    verified: false,
    admin: false
  }).returning('id')
  .then(function(userID) {
    queries.getSingleUser(userID[0])
    .then(function(user) {
      passportStub.login(user[0]);
      done();
    });
  });
}

function authenticateAdmin(done) {
  queries.addUser({
    username: 'admin',
    github_id: 654321,
    display_name: 'Jeremy Johnson',
    email: 'jeremy@realpython.com',
    access_token: '654321',
    verified: false,
    admin: true
  }).returning('id')
  .then(function(userID) {
    queries.getSingleUser(userID[0])
    .then(function(user) {
      passportStub.login(user[0]);
      done();
    });
  });
}

module.exports = {
  authenticateUser: authenticateUser,
  authenticateAdmin: authenticateAdmin
};
