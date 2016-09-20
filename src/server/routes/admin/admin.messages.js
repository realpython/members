var express = require('express');
var router = express.Router();

var authHelpers = require('../../auth/helpers');
var messageQueries = require('../../db/queries/messages');

// *** update message *** //
router.get('/:messageID/update', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var lessonID = parseInt(req.params.id);
  var messageID = parseInt(req.params.messageID);
  var backURL = req.header('Referer') || '/';
  return messageQueries.updateMessageUpdatedAt(messageID)
  .then(function(message) {
    req.flash('messages', {
      status: 'success',
      value: 'Message updated.'
    });
    return res.redirect(backURL);
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// *** deactivate message *** //
router.get('/:messageID/deactivate', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  // TODO: DRY code
  var messageType = req.query.type;
  var messageID = parseInt(req.params.messageID);
  var backURL = req.header('Referer') || '/';
  return messageQueries.deactivateMessage(messageID)
  .then(function(message) {
    if (messageType === 'parent') {
      return messageQueries.deactivateChildMessagesFromParent(messageID)
      .then(function(messages) {
        req.flash('messages', {
          status: 'success',
          value: 'Message(s) deactivated.'
        });
        return res.redirect(backURL);
      });
    } else {
      req.flash('messages', {
        status: 'success',
        value: 'Message(s) deactivated.'
      });
      return res.redirect(backURL);
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// // *** delete message *** //
// router.get('/:messageID/delete', authHelpers.ensureAdmin,
// function(req, res, next) {
//   // TODO: Add server side validation
//   // TODO: DRY code
//   var messageType = req.query.type;
//   var messageID = parseInt(req.params.messageID);
//   var backURL = req.header('Referer') || '/';
//   return messageQueries.deleteMessage(messageID)
//   .then(function(message) {
//     if (messageType === 'parent') {
//       return messageQueries.deleteChildMessagesFromParent(messageID)
//       .then(function(messages) {
//         req.flash('messages', {
//           status: 'success',
//           value: 'Message(s) removed.'
//         });
//         return res.redirect(backURL);
//       });
//     } else {
//       req.flash('messages', {
//         status: 'success',
//         value: 'Message(s) removed.'
//       });
//       return res.redirect(backURL);
//     }
//   })
//   .catch(function(err) {
//     // TODO: be more specific with the errors
//     return next(err);
//   });
// });

module.exports = router;
