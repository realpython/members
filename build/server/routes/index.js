var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
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
  var userID = parseInt(req.user.id);
  // get all side bar data
  routeHelpers.getSideBarData(userID)
  .then(function(data) {
    var sortedChapters = data.sortedChapters;
    var completed = data.completed;
    var totalActiveLessons = data.totalActiveLessons;
    // get completed percentage
    var percentage = ((completed.length / totalActiveLessons.length) *
      100).toFixed(0);
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
          completeNum: completed.length,
          completedArray: completed,
          feed: messageFeedData,
          totalLessons: totalActiveLessons.length,
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
