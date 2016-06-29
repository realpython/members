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

function chaptersAndLessons() {
  return knex.select('lessons.id as lessonID', 'lessons.order as lessonOrder', 'lessons.name as lessonName', 'lessons.content as lessonContent', 'lessons.read as lessonRead', 'chapters.id as chapterID', 'chapters.order as chapterOrder', 'chapters.name as chapterName', 'chapters.read as chapterRead')
    .from('chapters')
    .join('lessons', 'lessons.chapter_id', 'chapters.id');
}

module.exports = {
  getChapters: getChapters,
  getSingleChapter: getSingleChapter,
  getSingleChapterFromOrder: getSingleChapterFromOrder,
  updateChapterReadStatus: updateChapterReadStatus,
  chaptersAndLessons: chaptersAndLessons
};
