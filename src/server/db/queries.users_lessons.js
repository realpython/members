var knex = require('./knex');

function getAllUsersAndLessons() {
  return knex('users_lessons')
    .select('*');
}

function getUsersAndLessonsByUserID(userID) {
  return knex('users_lessons')
  .where('user_id', parseInt(userID))
  .returning('*');
}

function findAndUpdateLessonReadStatus(lessonID, userID, value) {
  return knex('users_lessons')
    .update({
      lesson_read: value
    })
    .where('lesson_id', parseInt(lessonID))
    .where('user_id', parseInt(userID))
    .returning('*');
}

function addRow(obj) {
  return knex('users_lessons')
    .insert(obj)
    .returning('*');
}

function getSingleLesson(lessonID, userID) {
  return knex('users_lessons')
    .where('lesson_id', parseInt(lessonID))
    .where('user_id', parseInt(userID))
    .returning('*');
}

module.exports = {
  getAllUsersAndLessons: getAllUsersAndLessons,
  getUsersAndLessonsByUserID: getUsersAndLessonsByUserID,
  findAndUpdateLessonReadStatus: findAndUpdateLessonReadStatus,
  addRow: addRow,
  getSingleLesson: getSingleLesson
};
