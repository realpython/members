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

function updateChapterReadStatus(chapterID, value) {
  return knex('chapters')
    .update('read', value)
    .where('id', chapterID);
}

module.exports = {
  getChapters: getChapters,
  getSingleChapter: getSingleChapter,
  updateChapterReadStatus: updateChapterReadStatus
};
