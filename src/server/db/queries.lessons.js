const knex = require('./knex');

function getAllLessons(callback) {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .then((lessons) => {
    callback(null, lessons);
  })
  .catch((err) => {
    callback(err);
  });
}

function getActiveLessons(callback) {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('active', true)
  .then((lessons) => {
    callback(null, lessons);
  })
  .catch((err) => {
    callback(err);
  });
}

function getInactiveLessons() {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('active', false);
}

function getActiveLessonOrderNumbers(callback) {
  return knex('lessons')
  .select('lesson_order_number')
  .orderBy('lesson_order_number')
  .where('active', true)
  .then((lessons) => {
    callback(null, lessons);
  })
  .catch((err) => {
    callback(err);
  });
}

function getLessonsFromChapterID(chapterID) {
  return knex('lessons')
  .select('*')
  .orderBy('lesson_order_number')
  .where('chapter_id', parseInt(chapterID))
  .where('active', true);
}

function getLessonChapterOrderNumsFromChapterID(chapterID, callback) {
  return knex('lessons')
  .select('chapter_order_number')
  .orderBy('chapter_order_number')
  .where('chapter_id', parseInt(chapterID))
  .then((lessons) => {
    callback(null, lessons);
  })
  .catch((err) => {
    callback(err);
  });
}

function getSingleLesson(lessonID, callback) {
  return knex('lessons')
  .select('*')
  .where('id', parseInt(lessonID))
  .then((lesson) => {
    callback(null, lesson);
  })
  .catch((err) => {
    callback(err);
  });
}

function getSingleLessonFromLessonID(lessonID) {
  return knex('lessons')
    .select('*')
    .where('id', parseInt(lessonID));
}

function getSingleLessonFromOrder(lessonOrderNum, callback) {
  return knex('lessons')
  .select('*')
  .where('lesson_order_number', parseInt(lessonOrderNum))
  .then((lesson) => {
    callback(null, lesson);
  })
  .catch((err) => {
    callback(err);
  });
}

function addLesson(obj, callback) {
  return knex('lessons')
  .insert(obj)
  .returning('*')
  .then((lesson) => {
    callback(null, lesson);
  })
  .catch((err) => {
    callback(err);
  });
}

function updateLesson(lessonID, obj) {
  return knex('lessons')
    .update(obj)
    .where('id', parseInt(lessonID))
    .returning('*');
}

function deactivateLesson(lessonID) {
  return knex('lessons')
    .update({
      active: false
    })
    .where('id', parseInt(lessonID))
    .returning('*');
}

function deactivateLessonsFromChapterID(chapterID) {
  return knex('lessons')
    .update({
      active: false
    })
    .where('chapter_id', parseInt(chapterID))
    .returning('*');
}

module.exports = {
  getAllLessons,
  getActiveLessons,
  getInactiveLessons: getInactiveLessons,
  getActiveLessonOrderNumbers,
  getLessonsFromChapterID: getLessonsFromChapterID,
  getLessonChapterOrderNumsFromChapterID,
  getSingleLesson,
  getSingleLessonFromLessonID: getSingleLessonFromLessonID,
  getSingleLessonFromOrder,
  addLesson,
  updateLesson: updateLesson,
  deactivateLesson: deactivateLesson,
  deactivateLessonsFromChapterID: deactivateLessonsFromChapterID
};
