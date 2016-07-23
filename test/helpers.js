var passportStub = require('passport-stub');
var queries = require('../src/server/db/queries.users');

function authenticateUser(done) {
  queries.addUser({
    github_username: 'michael',
    github_id: 123456,
    github_display_name: 'Michael Herman',
    github_access_token: '123456',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'michael@realpython.com',
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
    github_username: 'admin',
    github_id: 654321,
    github_display_name: 'Jeremy Johnson',
    github_access_token: '654321',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'jeremy@realpython.com',
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

var sampleUser = {
  githubUsername: 'red',
  githubID: 1234567,
  githubDisplayName: 'red',
  githubToken: '123456red',
  githubAvatar: 'https://avatars.io/static/default_128.jpg',
  email: 'red@red.com',
  verified: false,
  admin: false
};

var duplicateUser = {
  githubUsername: 'michael',
  githubID: 123456,
  githubDisplayName: 'Michael Herman',
  githubToken: '123456',
  githubAvatar: 'https://avatars.io/static/default_128.jpg',
  email: 'michael@realpython.com',
  verified: false,
  admin: false
};

var sampleChapter = {
  orderNumber: 9999,
  name: 'test chapter'
};

var duplicateChapter = {
  orderNumber: 1,
  name: 'duplicate chapter'
};

module.exports = {
  authenticateUser: authenticateUser,
  authenticateAdmin: authenticateAdmin,
  sampleUser: sampleUser,
  duplicateUser: duplicateUser,
  sampleChapter: sampleChapter,
  duplicateChapter: duplicateChapter
};
