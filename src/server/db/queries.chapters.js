var knex = require('./knex');

function getChapters() {
  return knex('chapters')
  .select('*')
  .orderBy('order_number');
}

function getSingleChapter(chapterID) {
  return knex('chapters')
    .select('*')
    .where('id', parseInt(chapterID));
}

function getSingleChapterFromOrder(orderNum) {
  return knex('chapters')
    .select('*')
    .where('order_number', parseInt(orderNum));
}

function chaptersAndLessons() {
  return knex.select('lessons.id as lessonID', 'lessons.lesson_order_number as lessonLessonOrder', 'lessons.chapter_order_number as lessonChapterOrder', 'lessons.name as lessonName', 'lessons.content as lessonContent', 'lessons.active as lessonActive', 'chapters.id as chapterID', 'chapters.order_number as chapterOrder', 'chapters.name as chapterName')
    .from('chapters')
    .join('lessons', 'lessons.chapter_id', 'chapters.id')
    .where('lessons.active', true);
}

function addChapter(obj) {
  return knex('chapters')
    .insert(obj)
    .returning('*');
}

function deactivateChapter(chapterID) {
  return knex('chapters')
    .update({
      active: false
    })
    .where('id', parseInt(chapterID))
    .returning('*');
}

function updateChapter(chapterID, obj) {
  return knex('chapters')
    .update(obj)
    .where('id', parseInt(chapterID))
    .returning('*');
}

module.exports = {
  getChapters: getChapters,
  getSingleChapter: getSingleChapter,
  getSingleChapterFromOrder: getSingleChapterFromOrder,
  chaptersAndLessons: chaptersAndLessons,
  addChapter: addChapter,
  deactivateChapter: deactivateChapter,
  updateChapter: updateChapter
};
