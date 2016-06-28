var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var userQueries = require('../db/queries.users');

router.get('/:id/profile', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var userID = parseInt(req.params.id);
  var renderObject = {
    title: 'Textbook LMS - user profile',
    pageTitle: 'User Profile',
    messages: req.flash('messages')
  };
  // get all chapters
  chapterQueries.getChapters()
  .then(function(chapters) {
    renderObject.chapters = chapters;
    // get single user
    return userQueries.getSingleUser(userID)
    .then(function(user) {
      if (user.length) {
        renderObject.user = user[0];
        res.render('profile', renderObject);
      } else {
        req.flash('messages', {
          status: 'success',
          value: 'That user does not exist.'
        });
        return res.redirect('/');
      }
    });
  })
  .catch(function(err) {
    next(err);
  });
});

// toggle admin status
if (process.env.NODE_ENV === 'development' || 'testing') {
  router.put('/:username/admin', function(req, res, next) {
    var update = req.body;
    if (!('admin' in req.body)) {
      res.status(403);
      res.json({
        message: 'You do not have permission to do that.'
      });
    } else {
      userQueries.getSingleUserByUsername(req.params.username)
      .then(function(user) {
        if (user.length) {
          return userQueries.makeAdmin(req.params.username, req.body.admin)
          .then(function(response) {
            res.json({
              status: 'success',
              message: 'User admin status updated.'
            });
          });
        } else {
          res.status(400);
          res.json({
            message: 'That user does not exist.'
          });
        }
      })
      .catch(function(err) {
        res.status(500);
        res.json({
          message: 'Something went wrong.'
        });
      });
    }
  });
}

module.exports = router;
