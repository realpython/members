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

function getSingleChapterFromOrder(order) {
  return knex('chapters')
    .select('*')
    .where('order', order);
}

function updateChapterReadStatus(chapterID, value) {
  return knex('chapters')
    .update('read', value)
    .where('id', chapterID);
}

module.exports = {
  getChapters: getChapters,
  getSingleChapter: getSingleChapter,
  getSingleChapterFromOrder: getSingleChapterFromOrder,
  updateChapterReadStatus: updateChapterReadStatus
};
