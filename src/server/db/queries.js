var knex = require('./knex');

// *** auth *** //

function getUsers() {
  return knex('users')
    .select();
}

function getSingleUser(userID) {
  return knex('users')
    .select()
    .where('id', userID);
}

function addUser(obj) {
  return knex('users')
    .insert(obj);
}

function makeAdmin(userID) {
  return knex('users')
    .where('id', parseInt(userID))
    .update({ admin: true });
}

module.exports = {
  getUsers: getUsers,
  getSingleUser: getSingleUser,
  addUser: addUser,
  makeAdmin: makeAdmin,
};