var knex = require('./knex');

function getMessages() {
  return knex('messages')
  .select('*')
  .orderBy('updated_at', 'desc');
}

function getParentMessages() {
  return knex('messages')
  .select('*')
  .where('parent_id', null)
  .orderBy('updated_at', 'desc');
}

function getChildMessages() {
  return knex('messages')
  .select('*')
  .whereNot('parent_id', null)
  .orderBy('updated_at', 'desc');
}

function getMessagesFromLessonID(lessonID) {
  return knex('messages')
  .select('*')
  .orderBy('updated_at', 'desc')
  .where('lesson_id', parseInt(lessonID));
}

function addMessage(obj) {
  return knex('messages')
    .insert(obj)
    .returning('*');
}

function messagesAndUsers(lessonID) {
  return knex
    .select('messages.id as messageID', 'messages.content as messageContent', 'messages.parent_id as messageParentID', 'messages.lesson_id as messageLessonID', 'messages.created_at as messageCreatedAt', 'messages.updated_at as messageUpdatedAt', 'users.id as userID', 'users.github_display_name as userGithubDisplayName', 'users.github_avatar as userGithubAvatar', 'users.created_at as userCreatedAt')
    .from('messages')
    .join('users', 'users.id', 'messages.user_id')
    .orderBy('messages.updated_at', 'desc')
    .where('messages.lesson_id', parseInt(lessonID));
}

function deleteChildMessagesFromParent(messageID) {
  return knex('messages')
  .del()
  .where('parent_id', parseInt(messageID));
}

function deleteMessage(messageID) {
  return knex('messages')
  .del()
  .where('id', parseInt(messageID));
}

function updateMessageUpdatedAt(messageID) {
  return knex('messages')
    .update({
      updated_at: new Date()
    })
    .where('id', parseInt(messageID))
    .returning('*');
}

module.exports = {
  getMessages: getMessages,
  getParentMessages: getParentMessages,
  getChildMessages: getChildMessages,
  getMessagesFromLessonID: getMessagesFromLessonID,
  addMessage: addMessage,
  messagesAndUsers: messagesAndUsers,
  deleteChildMessagesFromParent: deleteChildMessagesFromParent,
  deleteMessage: deleteMessage,
  updateMessageUpdatedAt: updateMessageUpdatedAt
};
