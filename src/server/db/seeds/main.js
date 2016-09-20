(function() {

  'use strict';

  const helpers = require('../_seed_helpers');

  exports.seed = (knex, Promise) => {
    return Promise.join(
      helpers.dropTables()
    )
    .then(() => {
      return Promise.all([
        helpers.insertUsers(),
        helpers.insertChapters()
      ]);
    })
    .then(() => {
      return Promise.join(
        helpers.getChapters()
      );
    })
    .then((chapters) => {
      return Promise.join(
        helpers.insertLessons(chapters)
      );
    })
    .then(() => {
      return Promise.join(
        helpers.getUsers()
      );
    })
    .then((users) => {
      return Promise.join(
        helpers.getLessons()
      )
      .then((lessons) => {
        const allPromises = lessons[0].map((lesson) => {
          return helpers.insertUsersLessons(
            parseInt(users[0][0].id), parseInt(lesson.id));
        });
        return Promise.all(allPromises);
      });
    })
    .then(() => {
      return Promise.join(
        helpers.getUsers()
      );
    })
    .then((users) => {
      return Promise.join(
        helpers.insertMessages(parseInt(users[0][0].id))
      )
      .then((messages) => {
        return Promise.join(
          helpers.insertMessageReplies(
            parseInt(messages[0][0][0]), parseInt(users[0][0].id))
        );
      })
      .then(() => {
        return Promise.join(
          helpers.insertSuggestions(parseInt(users[0][0].id))
        );
      });
    })
    .then(() => {
      return Promise.join(
        helpers.insertCodes()
      );
    })
    .then(() => {});
  };

}());
