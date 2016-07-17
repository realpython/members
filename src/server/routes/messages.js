var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var messageQueries = require('../db/queries.messages');

// *** add new message *** //
router.post('/', authHelpers.ensureAuthenticated,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var messageObject = {
    content: payload.comment,
    parent_id: parseInt(payload.parent) || null,
    lesson_id: parseInt(payload.lesson),
    user_id: parseInt(req.user.id)
  };
  return messageQueries.addMessage(messageObject)
  .then(function(response) {
    if (response.length) {
      req.flash('messages', {
        status: 'success',
        value: 'Message added.'
      });
      return res.redirect('/lessons/' + payload.lesson);
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Something went wrong.'
      });
      return res.redirect('/lessons/' + payload.lesson);
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
