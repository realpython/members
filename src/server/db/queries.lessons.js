var knex = require('./knex');

function getLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('order');
}

function getLessonsFromChapterID(chapterID) {
  return knex('lessons')
  .select('*')
  .orderBy('order')
  .where('chapter_id', parseInt(chapterID));
}

function getSingleLesson(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', parseInt(lessonID));
}

function getSingleLessonFromOrder(order) {
  return knex('lessons')
    .select('*')
    .where('order', order);
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
