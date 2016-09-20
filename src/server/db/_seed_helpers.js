(function() {

  'use strict';

  const knex = require('./connection');

  function dropTables() {
    return Promise.all([
      knex('chapters').del(),
      knex('lessons').del(),
      knex('users').del(),
      knex('messages').del(),
      knex('suggestions').del(),
      knex('codes').del()
    ]);
  }

  function insertUsers() {
    return knex('users')
    .insert({
      github_username: 'Michael',
      github_id: 987,
      github_display_name: 'Michael Johnson',
      github_access_token: '798',
      github_avatar: 'https://avatars.io/static/default_128.jpg',
      email: 'michael@johnson.com',
      verified: false,
      admin: false
    });
  }

  function insertChapters() {
    return Promise.all([
      knex('chapters').insert({
        order_number: 1,
        name: 'Functions and Loops'
      }),
      knex('chapters').insert({
        order_number: 2,
        name: 'Conditional logic'
      }),
      knex('chapters').insert({
        order_number: 3,
        name: 'Lists and Dictionaries'
      }),
      knex('chapters').insert({
        order_number: 4,
        name: 'Inactive Chapter',
        active: false
      })
    ]);
  }

  function getChapters() {
    return knex('chapters')
    .select('*')
    .orderBy('order_number')
    .returning('*');
  }

  module.exports = {
    dropTables,
    insertUsers,
    insertChapters,
    getChapters
  };

}());
