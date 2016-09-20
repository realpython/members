(function() {

  'use strict';

  const helpers = require('../_seed_helpers');
  var userID;

  exports.seed = (knex, Promise) => {
    return helpers.dropTables()
    .then(() => { return helpers.insertUsers(); })
    .then(() => { return helpers.insertChapters(); })
    .then(() => { return helpers.getChapters(); })
    .then((chapters) => { return helpers.insertLessons(chapters); })
    .then(() => { return helpers.getUsers(); })
    .then((users) => {
      userID = parseInt(users[0].id);
      return helpers.getLessons();
    })
    .then((lessons) => {
      const allPromises = lessons.map((lesson) => {
        return helpers.insertUsersLessons(userID, parseInt(lesson.id));
      });
      return Promise.all(allPromises);
    })
    .then(() => { return helpers.insertMessages(userID); })
    .then((messages) => {
      return helpers.insertMessageReplies(
        parseInt(messages[0][0]), userID);
    })
    .then(() => { return helpers.insertSuggestions(userID); })
    .then(() => { return helpers.insertCodes(); })
    .catch((err) => console.log(err));
  };

}());
