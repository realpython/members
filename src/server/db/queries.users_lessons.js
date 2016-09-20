const knex = require('./connection');
const lessonQueries = require('./queries.lessons');

function addRow(obj, callback) {
  return knex('users_lessons')
  .insert(obj)
  .returning('*')
  .then((row) => {
    callback(null, row);
  })
  .catch((err) => {
    callback(err);
  });
}

function addNewUser(userID, callback) {
  return lessonQueries.getAllLessons()
  .then((lessons) => {
    lessons.forEach((lesson) => {
      return addRow({
        user_id: parseInt(userID),
        lesson_id: lesson.id
      })
      .then((results) => {})
      .catch((err) => {
        callback(err);
      });
    });
    callback(null, 'success');
  });
}

function getAllUsersAndLessons(callback) {
  return knex('users_lessons')
  .select('*')
  .then((userAndLessons) => {
    callback(null, userAndLessons);
  })
  .catch((err) => {
    console.log(err);
    callback(err);
  });
}

function getUsersAndLessonsByUserID(userID, callback) {
  return knex('users_lessons')
  .where('user_id', parseInt(userID))
  .returning('*')
  .then((userAndLessons) => {
    callback(null, userAndLessons);
  })
  .catch((err) => {
    callback(err);
  });
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

function getSingleLesson(lessonID, userID, callback) {
  return knex('users_lessons')
  .where('lesson_id', parseInt(lessonID))
  .where('user_id', parseInt(userID))
  .returning('*')
  .then((lessons) => {
    callback(null, lessons);
  })
  .catch((err) => {
    callback(err);
  });
}

module.exports = {
  addRow,
  addNewUser,
  getAllUsersAndLessons,
  getUsersAndLessonsByUserID,
  findAndUpdateLessonReadStatus,
  getSingleLesson
};
