var knex = require('./knex');

function getLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number');
}

function getLessonOrderNumbers() {
  return knex('lessons')
  .select('lesson_order_number')
  .orderBy('lesson_order_number');
}

function getLessonsFromChapterID(chapterID) {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('chapter_id', parseInt(chapterID));
}

function getLessonChapterOrderNumsFromChapterID(chapterID) {
  return knex('lessons')
  .select('chapter_order_number')
  .orderBy('chapter_order_number')
  .where('chapter_id', parseInt(chapterID));
}

function getSingleLesson(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', parseInt(lessonID));
}

function getSingleLessonFromLessonID(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', parseInt(lessonID));
}

function getSingleLessonFromOrder(lessonOrderNum) {
  return knex('lessons')
    .select('*')
    .where('lesson_order_number', parseInt(lessonOrderNum));
}

function updateLessonReadStatus(lessonID, value) {
  return knex('lessons')
    .update('read', value)
    .where('id', parseInt(lessonID));
}

function addLesson(obj) {
  return knex('lessons')
    .insert(obj)
    .returning('*');
}

module.exports = {
  getLessons: getLessons,
  getLessonOrderNumbers: getLessonOrderNumbers,
  getLessonsFromChapterID: getLessonsFromChapterID,
  getLessonChapterOrderNumsFromChapterID: getLessonChapterOrderNumsFromChapterID,
  getSingleLesson: getSingleLesson,
  getSingleLessonFromLessonID: getSingleLessonFromLessonID,
  getSingleLessonFromOrder: getSingleLessonFromOrder,
  updateLessonReadStatus: updateLessonReadStatus,
  addLesson: addLesson
};
