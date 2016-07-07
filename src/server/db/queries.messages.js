var knex = require('./knex');

function getMessages() {
  return knex('messages')
  .select('*')
  .orderBy('created_at');
}

function getMessagesFromLessonID(lessonID) {
  return knex('messages')
  .select('*')
  .orderBy('created_at')
  .where('lesson_id', parseInt(lessonID));
}

module.exports = {
  getMessages: getMessages,
  getMessagesFromLessonID: getMessagesFromLessonID
};
