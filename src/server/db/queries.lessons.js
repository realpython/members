var knex = require('./knex');

function getLessons(chapterID) {
  return knex('lessons')
    .select('*')
    .where('chapter_id', parseInt(chapterID));
}

module.exports = {
  getLessons: getLessons
};
