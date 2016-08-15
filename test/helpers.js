var passportStub = require('passport-stub');

var knex = require('../src/server/db/knex');
var queries = require('../src/server/db/queries.users');
var Promise = require('es6-promise').Promise;

function authenticateActiveUser(done) {
  queries.addUser({
    github_username: 'michael',
    github_id: 123456,
    github_display_name: 'Michael Herman',
    github_access_token: '123456',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'michael@realpython.com',
    verified: false,
    admin: false,
    active: true
  }).returning('id')
  .then(function(singleUser) {
    var userID = parseInt(singleUser[0]);
    return Promise.all([
      knex('lessons').select('*')
    ])
    .then(function(lessons) {
      Promise.all(
      lessons[0].map(function(lesson) {
        return new Promise(function(resolve, reject) {
          return knex('users_lessons')
          .insert({
            user_id: userID,
            lesson_id: lesson.id,
            lesson_read: false
          }).returning('*')
          .then(function(results) {
            resolve();
          });
        });
      }))
      .then(function() {
        queries.getSingleUser(userID)
        .then(function(user) {
          passportStub.login(user[0]);
          done();
        });
      });
    });
  });
}

function authenticateAndVerifyActiveUser(done) {
  queries.addUser({
    github_username: 'michael',
    github_id: 123456,
    github_display_name: 'Michael Herman',
    github_access_token: '123456',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'michael@realpython.com',
    verified: true,
    admin: false,
    active: true
  }).returning('id')
  .then(function(singleUser) {
    var userID = parseInt(singleUser[0]);
    return Promise.all([
      knex('lessons').select('*')
    ])
    .then(function(lessons) {
      Promise.all(
      lessons[0].map(function(lesson) {
        return new Promise(function(resolve, reject) {
          return knex('users_lessons')
          .insert({
            user_id: userID,
            lesson_id: lesson.id,
            lesson_read: false
          }).returning('*')
          .then(function(results) {
            resolve();
          });
        });
      }))
      .then(function() {
        queries.getSingleUser(userID)
        .then(function(user) {
          passportStub.login(user[0]);
          done();
        });
      });
    });
  });
}

function authenticateAndVerifyInactiveUser(done) {
  queries.addUser({
    github_username: 'michael',
    github_id: 123456,
    github_display_name: 'Michael Herman',
    github_access_token: '123456',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'michael@realpython.com',
    verified: true,
    admin: false,
    active: false
  }).returning('id')
  .then(function(singleUser) {
    var userID = parseInt(singleUser[0]);
    return Promise.all([
      knex('lessons').select('*')
    ])
    .then(function(lessons) {
      // update users_lessons
      lessons[0].forEach(function(lesson) {
        knex('users_lessons')
        .insert({
          user_id: userID,
          lesson_id: lesson.id,
          lesson_read: false
        }).returning('*')
        .then(function(results) {});
      });
      queries.getSingleUser(userID)
      .then(function(user) {
        passportStub.login(user[0]);
        done();
      });
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
    verified: true,
    admin: true
  }).returning('id')
  .then(function(singleUser) {
    var userID = parseInt(singleUser[0]);
    return Promise.all([
      knex('lessons').select('*')
    ])
    .then(function(lessons) {
      Promise.all(
      lessons[0].map(function(lesson) {
        return new Promise(function(resolve, reject) {
          return knex('users_lessons')
          .insert({
            user_id: userID,
            lesson_id: lesson.id,
            lesson_read: false
          }).returning('*')
          .then(function(results) {
            resolve();
          });
        });
      }))
      .then(function() {
        queries.getSingleUser(userID)
        .then(function(user) {
          passportStub.login(user[0]);
          done();
        });
      });
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

var updateUser = {
  githubUsername: 'red',
  githubID: 1234567,
  githubDisplayName: 'red',
  githubToken: '123456red',
  githubAvatar: 'https://avatars.io/static/default_128.jpg',
  email: 'red@red.com',
  verified: false,
  admin: false,
  active: false
};

var sampleChapter = {
  orderNumber: 9999,
  name: 'test chapter'
};

var duplicateChapter = {
  orderNumber: 1,
  name: 'duplicate chapter'
};

var sampleLesson = {
  chapter: 1,
  name: 'test lesson',
  content: 'just some content'
};

var duplicateLesson = {
  chapter: 1,
  name: 'Lesson 1a',
  content: 'just some content'
};

var updateLesson = {
  lessonOrderNumber: 1,
  chapterOrderNumber: 1,
  lessonName: 'Lesson 1aaaaaaa',
  lessonContent: 'test',
  lessonActive: 'false',
  chapter: 1
};

var updateChapter = {
  chapterOrderNumber: 22,
  chapterName: 'Chapter Blah',
  chapterActive: 'false'
};

module.exports = {
  authenticateActiveUser: authenticateActiveUser,
  authenticateAndVerifyActiveUser: authenticateAndVerifyActiveUser,
  authenticateAndVerifyInactiveUser: authenticateAndVerifyInactiveUser,
  authenticateAdmin: authenticateAdmin,
  sampleUser: sampleUser,
  duplicateUser: duplicateUser,
  updateUser: updateUser,
  sampleChapter: sampleChapter,
  duplicateChapter: duplicateChapter,
  sampleLesson: sampleLesson,
  duplicateLesson: duplicateLesson,
  updateLesson: updateLesson,
  updateChapter: updateChapter
};
