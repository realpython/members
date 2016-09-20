(function() {

  'use strict';

  const helpers = require('../_seed_helpers');
  var allUsers;

  exports.seed = (knex, Promise) => {
    return helpers.dropTables()
    .then(() => {
      return helpers.insertUsers();
    })
    .then(() => {
      return helpers.insertChapters();
    })
    .then(() => {
      return helpers.getChapters();
    })
    .then((chapters) => {
      return helpers.insertLessons(chapters);
    })
    .then(() => {
      return helpers.getUsers();
    })
    .then((users) => {
      allUsers = users;
      return helpers.getLessons();
    })
    .then((lessons) => {
      const allPromises = lessons.map((lesson) => {
        return helpers.insertUsersLessons(
          parseInt(allUsers[0].id), parseInt(lesson.id));
      });
      return Promise.all(allPromises);
    })
    .then(() => {
      return helpers.insertMessages(parseInt(allUsers[0].id));
    })
    .then((messages) => {
      return helpers.insertMessageReplies(
        parseInt(messages[0][0]), parseInt(allUsers[0].id));
    })
    .then(() => {
      return helpers.insertSuggestions(parseInt(allUsers[0].id));
    })
    .then(() => {
      return helpers.insertCodes();
    });
  };

}());
