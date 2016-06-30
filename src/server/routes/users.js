var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var userQueries = require('../db/queries.users');
var routeHelpers = require('./_helpers');

// *** get user profile *** //
router.get('/:id/profile', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var userID = parseInt(req.params.id);
  var renderObject = {
    title: 'Textbook LMS - user profile',
    pageTitle: 'User Profile',
    messages: req.flash('messages')
  };
  // get all chapters and associated lessons
  // for the sidebar and navbar
  chapterQueries.chaptersAndLessons()
  .then(function(results) {
    // filter and reduce the results
    var reducedResults = routeHelpers.reduceResults(results);
    var chaptersAndLessons = routeHelpers.convertArray(reducedResults);
    renderObject.chaptersAndLessons = chaptersAndLessons;
    // get single user
    userQueries.getSingleUser(userID)
    .then(function(user) {
      if (user.length) {
        renderObject.user = user[0];
        return res.render('profile', renderObject);
      } else {
        req.flash('messages', {
          status: 'danger',
          value: 'That user does not exist.'
        });
        return res.redirect('/');
      }
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** toggle admin status *** //
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
          userQueries.makeAdmin(req.params.username, req.body.admin)
          .then(function(response) {
            return res.status(200).json({
              status: 'success',
              message: 'User admin status updated.'
            });
          });
        } else {
          return res.status(400).json({
            message: 'That user does not exist.'
          });
        }
      })
      .catch(function(err) {
        return res.status(500).json({
          message: 'Something went wrong.'
        });
      });
    }
  });
}

module.exports = router;
