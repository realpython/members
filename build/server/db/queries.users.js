var knex = require('./knex');

function getUsers() {
  return knex('users')
    .select('*');
}

function getTotalUsers() {
  return knex('users')
    .count('*');
}

function getSingleUser(userID) {
  return knex('users')
    .select('*')
    .where('id', parseInt(userID));
}

function getSingleUserByUsername(username) {
  return knex('users')
    .select('*')
    .where('github_username', username)
    .returning('*');
}

function addUser(obj) {
  return knex('users')
    .insert(obj)
    .returning('*');
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

function getMessageFeedData() {
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
    .limit(10);
}

function getReadLessons(userID) {
  return knex('users_lessons')
  .where({
    user_id: parseInt(userID),
    lesson_read: true
  })
  .returning('*');
}

module.exports = {
  getUsers: getUsers,
  getTotalUsers: getTotalUsers,
  getSingleUser: getSingleUser,
  getSingleUserByUsername: getSingleUserByUsername,
  addUser: addUser,
  makeAdmin: makeAdmin,
  makeActive: makeActive,
  verifyUser: verifyUser,
  updateUser: updateUser,
  deactivateUser: deactivateUser,
  unverifyUser: unverifyUser,
  getMessageFeedData: getMessageFeedData,
  getReadLessons: getReadLessons
};
