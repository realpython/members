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

function getSingleLessonFromOrder(order) {
  return knex('lessons')
    .select('*')
    .where('order', order);
}

function updateLessonReadStatus(lessonID, value) {
  return knex('lessons')
    .update('read', value)
    .where('id', lessonID);
}

module.exports = {
  getLessons: getLessons,
  getSingleLesson: getSingleLesson,
  getSingleLessonFromOrder: getSingleLessonFromOrder,
  updateLessonReadStatus: updateLessonReadStatus
};
