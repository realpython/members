var knex = require('./knex');

function getStandards(chapterID) {
  return knex('standards')
    .select('*')
    .where('chapter_id', parseInt(chapterID));
}

module.exports = {
  getStandards: getStandards
};
