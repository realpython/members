var knex = require('../connection');

function addUser(obj, callback) {
  return knex('users')
  .insert(obj)
  .returning('*')
  .then((user) => {
    callback(null, user);
  })
  .catch((err) => {
    callback(err);
  });
}

function getSingleUserByGithubID(githubID, callback) {
  return knex('users')
  .select('*')
  .where('github_id', githubID)
  .then((user) => {
    callback(null, user);
  })
  .catch((err) => {
    callback(err);
  });
}

function getSingleUserByID(userID, callback) {
  return knex('users')
  .select('*')
  .where('id', userID)
  .then((user) => {
    callback(null, user);
  })
  .catch((err) => {
    callback(err);
  });
}

function getSingleUser(userID) {
  return knex('users')
  .select('*')
  .where('id', userID);
}

function getUsers(callback) {
  return knex('users')
  .select('*')
  .then((users) => {
    callback(null, users);
  })
  .catch((err) => {
    callback(err);
  });
}

function getTotalUsers(callback) {
  return knex('users')
  .count('*')
  .then((users) => {
    callback(null, users);
  })
  .catch((err) => {
    callback(err);
  });
}

function getSingleUserByUsername(username, callback) {
  return knex('users')
  .select('*')
  .where('github_username', username)
  .returning('*')
  .then((user) => {
    callback(null, user);
  })
  .catch((err) => {
    callback(err);
  });
}

function makeAdmin(username, value) {
  return knex('users')
    .update({
      admin: value,
      active: true
    })
    .where('github_username', username);
}

function makeActive(username, value) {
  return knex('users')
    .update({
      active: value
    })
    .where('github_username', username);
}

function verifyUser(userID, code) {
  return knex('users')
    .update({
      verified: true,
      verify_code: code
    })
    .where('id', parseInt(userID))
    .returning('*');
}

function updateUser(userID, obj) {
  return knex('users')
    .update(obj)
    .where('id', parseInt(userID))
    .returning('*');
}

function deactivateUser(userID) {
  return knex('users')
    .update({
      active: false
    })
    .where('id', parseInt(userID))
    .returning('*');
}

function unverifyUser(userID) {
  return knex('users')
    .update({
      verified: false
    })
    .where('id', parseInt(userID))
    .returning('*');
}

function getMessageFeedData(callback) {
  return knex
  .select(
    'messages.id as messageID',
    'messages.updated_at as updatedAt',
    'users.github_display_name as userGithubDisplayName',
    'lessons.id as lessonID',
    'lessons.name as lessonName'
  )
  .from('messages')
  .join('users', 'users.id', 'messages.user_id')
  .join('lessons', 'lessons.id', 'messages.lesson_id')
  .orderBy('messages.updated_at', 'desc')
  .limit(10)
  .then((messages) => {
    callback(null, messages);
  })
  .catch((err) => {
    callback(err);
  });
}

function getReadLessons(userID, callback) {
  return knex('users_lessons')
  .where({
    user_id: parseInt(userID),
    lesson_read: true
  })
  .returning('*')
  .then((lessons) => {
    callback(null, lessons);
  })
  .catch((err) => {
    callback(err);
  });
}

module.exports = {
  getSingleUser,
  addUser,
  getSingleUserByGithubID,
  getSingleUserByID,
  getUsers,
  getTotalUsers,
  getSingleUserByUsername,
  makeAdmin: makeAdmin,
  makeActive: makeActive,
  verifyUser: verifyUser,
  updateUser: updateUser,
  deactivateUser: deactivateUser,
  unverifyUser: unverifyUser,
  getMessageFeedData,
  getReadLessons
};
