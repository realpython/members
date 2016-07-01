var knex = require('./knex');

function getLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number');
}

function getLessonsFromChapterID(chapterID) {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('chapter_id', parseInt(chapterID));
}

function getSingleLesson(lessonID) {
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

module.exports = {
  getLessons: getLessons,
  getLessonsFromChapterID: getLessonsFromChapterID,
  getSingleLesson: getSingleLesson,
  getSingleLessonFromOrder: getSingleLessonFromOrder,
  updateLessonReadStatus: updateLessonReadStatus
};
