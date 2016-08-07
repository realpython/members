var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var userQueries = require('../db/queries.users');
var routeHelpers = require('./_helpers');

// *** sanity check *** //
router.get('/ping', function(req, res, next) {
  res.send('pong!');
});

// *** dashboard *** //
router.get('/',
  authHelpers.ensureAuthenticated,
  authHelpers.ensureVerified,
  authHelpers.ensureActive,
  function(req, res, next) {
  // get all chapters and associated lessons
  // for the sidebar and navbar
  return chapterQueries.chaptersAndLessons()
  .then(function(results) {
    // filter, reduce, and sort the results
    var reducedResults = routeHelpers.reduceResults(results);
    var chapters = routeHelpers.convertArray(reducedResults);
    var sortedChapters = routeHelpers.sortLessonsByOrderNumber(chapters);
    // get total lessons
    var totalLessons = routeHelpers.getTotalLessons(sortedChapters);
    // get completed lessons
    var completed = routeHelpers.getCompletedLessons(sortedChapters);
    // get completed percentage
    var percentage = ((completed / totalLessons) * 100).toFixed(0);
    // get feed data
    return userQueries.getMessageFeedData()
    .then(function(messageFeedData) {
      // get total users
      return userQueries.getTotalUsers()
      .then(function(totalUsers) {
        var renderObject = {
          title: 'Textbook LMS - dashboard',
          pageTitle: 'Dashboard',
          user: req.user,
          sortedChapters: sortedChapters,
          completed: percentage,
          feed: messageFeedData,
          totalLessons: totalLessons,
          totalUsers: totalUsers[0].count,
          messages: req.flash('messages')
        };
        if (req.user.admin) {
          if (parseInt(process.env.CAN_VERIFY) === 1) {
            renderObject.verify = true;
          }
        }
        return res.render('dashboard', renderObject);
      });
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
