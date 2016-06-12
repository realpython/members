var passportStub = require('passport-stub');
var queries = require('../src/server/db/queries');

function authenticateUser(done) {
  queries.addUser({
    username: 'michael',
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

module.exports = {
  authenticateUser: authenticateUser
};
