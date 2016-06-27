var knex = require('./knex');

function getUsers() {
  return knex('users')
    .select('*');
}

function getSingleUser(userID) {
  return knex('users')
    .select('*')
    .where('id', parseInt(userID));
}

function getSingleUserByUsername(username) {
  return knex('users')
    .select('*')
    .where('username', username)
    .returning('username');
}

function addUser(obj) {
  return knex('users')
    .insert(obj);
}

function makeAdmin(username, value) {
  return knex('users')
    .update({ admin: value })
    .where('username', username);
}

module.exports = {
  getUsers: getUsers,
  getSingleUser: getSingleUser,
  getSingleUserByUsername: getSingleUserByUsername,
  addUser: addUser,
  makeAdmin: makeAdmin
};
