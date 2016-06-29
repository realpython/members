var knex = require('./knex');

function getLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('order');
}

function getSingleLesson(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', lessonID);
}

function updateLessonReadStatus(lessonID, value) {
  return knex('lessons')
    .update('read', value)
    .where('id', lessonID);
}

module.exports = {
  getLessons: getLessons,
  getSingleLesson: getSingleLesson,
  updateLessonReadStatus: updateLessonReadStatus
};
