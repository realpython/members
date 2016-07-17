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

function addMessage(obj) {
  return knex('messages')
    .insert(obj)
    .returning('*');
}

function messagesAndUsers(lessonID) {
  return knex
    .select('messages.id as messageID', 'messages.content as messageContent', 'messages.parent_id as messageParentID', 'messages.lesson_id as messageLessonID', 'messages.created_at as messageCreatedAt', 'users.id as userID', 'users.github_display_name as userGithubDisplayName', 'users.github_avatar as userGithubAvatar', 'users.created_at as userCreatedAt')
    .from('messages')
    .join('users', 'users.id', 'messages.user_id')
    .orderBy('messages.created_at')
    .where('messages.lesson_id', parseInt(lessonID));
}

module.exports = {
  getMessages: getMessages,
  getMessagesFromLessonID: getMessagesFromLessonID,
  addMessage: addMessage,
  messagesAndUsers: messagesAndUsers
};
