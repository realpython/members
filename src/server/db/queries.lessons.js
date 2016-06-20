var knex = require('./knex');

function getLessons() {
  return knex('lessons')
    .select('*');
}

function getLessonsByChapter(chapterID) {
  return knex('lessons')
    .select('*')
    .where('chapter_id', parseInt(chapterID));
}

module.exports = {
  getLessons: getLessons
};
