var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var messageQueries = require('../db/queries.messages');

// *** delete message *** //
router.get('/:messageID/delete', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var messageID = parseInt(req.params.messageID);
  var backURL = req.header('Referer') || '/';
  return messageQueries.deleteChildMessagesFromParent(messageID)
  .then(function(messages) {
    return messageQueries.deleteParentMessage(messageID)
    .then(function(message) {
      req.flash('messages', {
        status: 'success',
        value: 'Message(s) removed.'
      });
      return res.redirect(backURL);
    });
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
