const knex = require('./knex');

function getActiveMessages(callback) {
  return knex('messages')
  .select('*')
  .where('active', true)
  .orderBy('updated_at', 'desc')
  .then((messages) => {
    callback(null, messages);
  })
  .catch((err) => {
    callback(err);
  });
}

function getInactiveMessages(callback) {
  return knex('messages')
  .select('*')
  .where('active', false)
  .orderBy('updated_at', 'desc')
  .then((messages) => {
    callback(null, messages);
  })
  .catch((err) => {
    callback(err);
  });
}

function getAllMessages() {
  return knex('messages')
  .select('*')
  .orderBy('updated_at', 'desc');
}

function getActiveParentMessages() {
  return knex('messages')
  .select('*')
  .where('parent_id', null)
  .where('active', true)
  .orderBy('updated_at', 'desc');
}

function getActiveChildMessages() {
  return knex('messages')
  .select('*')
  .whereNot('parent_id', null)
  .where('active', true)
  .orderBy('updated_at', 'desc');
}

function getMessagesFromLessonID(lessonID) {
  return knex('messages')
  .select('*')
  .orderBy('updated_at', 'desc')
  .where('active', true)
  .where('lesson_id', parseInt(lessonID));
}

function addMessage(obj) {
  return knex('messages')
    .insert(obj)
    .returning('*');
}

function messagesAndUsers(lessonID, callback) {
  return knex
  .select(
    'messages.id as messageID',
    'messages.content as messageContent',
    'messages.parent_id as messageParentID',
    'messages.lesson_id as messageLessonID',
    'messages.created_at as messageCreatedAt',
    'messages.updated_at as messageUpdatedAt',
    'users.id as userID',
    'users.github_display_name as userGithubDisplayName', 'users.github_avatar as userGithubAvatar',
    'users.created_at as userCreatedAt',
    'users.admin as userAdmin'
  )
  .from('messages')
  .join('users', 'users.id', 'messages.user_id')
  .orderBy('messages.updated_at', 'desc')
  .where('messages.lesson_id', parseInt(lessonID))
  .where('messages.active', true)
  .then((results) => {
    callback(null, results);
  })
  .catch((err) => {
    callback(err);
  });
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

function deactivateMessage(messageID) {
  return knex('messages')
    .update({
      active: false,
      updated_at: new Date()
    })
    .where('id', parseInt(messageID))
    .returning('*');
}

function deactivateChildMessagesFromParent(messageID) {
  return knex('messages')
  .update({
    active: false,
    updated_at: new Date()
  })
  .where('parent_id', parseInt(messageID));
}

module.exports = {
  getActiveMessages,
  getInactiveMessages,
  getAllMessages: getAllMessages,
  getActiveParentMessages: getActiveParentMessages,
  getActiveChildMessages: getActiveChildMessages,
  getMessagesFromLessonID: getMessagesFromLessonID,
  addMessage: addMessage,
  messagesAndUsers,
  deleteChildMessagesFromParent: deleteChildMessagesFromParent,
  deleteMessage: deleteMessage,
  updateMessageUpdatedAt: updateMessageUpdatedAt,
  deactivateMessage: deactivateMessage,
  deactivateChildMessagesFromParent: deactivateChildMessagesFromParent
};
