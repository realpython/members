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
      // console.log(chapters);
    });
  };

}());
