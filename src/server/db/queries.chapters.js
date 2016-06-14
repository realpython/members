var knex = require('./knex');

function getChapters() {
  return knex('chapters')
    .select('*');
}

module.exports = {
  getChapters: getChapters
};
