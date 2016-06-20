var knex = require('./knex');

function getChapters() {
  return knex('chapters')
  .select('*')
  .orderBy('order');
}

function getSingleChapter(chapterID) {
  return knex('chapters')
    .select('*')
    .where('id', chapterID);
}

module.exports = {
  getChapters: getChapters,
  getSingleChapter: getSingleChapter
};
