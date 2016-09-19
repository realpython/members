const passportStub = require('passport-stub');

const knex = require('../server/db/knex');
const userQueries = require('../server/db/queries.users');
const lessonsQueries = require('../server/db/queries.lessons');
const codeQueries = require('../server/db/queries.codes');
const usersLessonsQueries = require('../server/db/queries.users_lessons');

// TODO: Make authenticate dynamic based on permissions

function authenticate(statusObject, done) {
  const userObject = {
    github_username: 'fletcher',
    github_id: 99887766,
    github_display_name: 'Fletcher Heisler',
    github_access_token: '99887766',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'fletcher@realpython.com',
    verified: statusObject.verified,
    admin: statusObject.admin,
    active: statusObject.active,
    verify_code: '21049144460970398511'
  };
  userQueries.addUser(userObject, (err, user) => {
    lessonsQueries.getAllLessons((err, lessons) => {
      lessons.map((lesson) => {
        const obj = {
          user_id: parseInt(user[0].id),
          lesson_id: parseInt(lesson.id),
          lesson_read: false
        };
        usersLessonsQueries.addRow(obj, (err, res) => {});
      });
      const codeObject = {
        verify_code: '21049144460970398511'
      };
      codeQueries.addCode(codeObject, (err, res) => {
        passportStub.login(user[0]);
        done();
      });
    });
  });
}

function authenticateDuplicate(statusObject, done) {
  const userObject = {
    github_username: 'jeremy',
    github_id: 20191817,
    github_display_name: 'Jeremy Johnson',
    github_access_token: '20191817',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'jeremy@realpython.com',
    verified: statusObject.verified,
    admin: statusObject.admin,
    active: statusObject.active
  };
  userQueries.addUser(userObject, (err, user) => {
    lessonsQueries.getAllLessons((err, lessons) => {
      lessons.map((lesson) => {
        const obj = {
          user_id: parseInt(user[0].id),
          lesson_id: parseInt(lesson.id),
          lesson_read: false
        };
        usersLessonsQueries.addRow(obj, (err, res) => {});
      });
      done();
    });
  });
}

function authenticateAndVerifyActiveAdminUser(done) {
  userQueries.addUser({
    github_username: 'fletcher',
    github_id: 99887766,
    github_display_name: 'Fletcher Heisler',
    github_access_token: '99887766',
    github_avatar: 'https://avatars.io/static/default_128.jpg',
    email: 'fletcher@realpython.com',
    verified: true,
    admin: true,
    active: true,
    verify_code: '21049144460970398511'
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
        var codeObject = {
          verify_code: '21049144460970398511'
        };
        codeQueries.addCode(codeObject)
        .then(function(test) {
          userQueries.getSingleUser(userID)
          .then(function(user) {
            passportStub.login(user[0]);
            done();
          });
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
  githubUsername: 'Michael',
  githubID: 123456,
  githubDisplayName: 'Michael Herman',
  githubToken: '123456',
  githubAvatar: 'https://avatars.io/static/default_128.jpg',
  email: 'michael@realpython.com',
  verified: false,
  admin: false
};

var duplicateVerificationCodeUser = {
  githubUsername: 'Michael',
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

var lessonRead = {
  chapter: 1,
  lesson: 2,
  read: true
};

var lessonUnread = {
  chapter: 1,
  lesson: 2,
  read: false
};

module.exports = {
  authenticate,
  authenticateDuplicate,
  sampleUser: sampleUser,
  duplicateUser: duplicateUser,
  updateUser: updateUser,
  sampleChapter: sampleChapter,
  duplicateChapter: duplicateChapter,
  sampleLesson: sampleLesson,
  duplicateLesson: duplicateLesson,
  updateLesson: updateLesson,
  updateChapter: updateChapter,
  lessonRead: lessonRead,
  lessonUnread: lessonUnread
};
