var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var routeHelpers = require('./_helpers');

// *** sanity check *** //
router.get('/ping', function(req, res, next) {
  res.send('pong!');
});

// *** dashboard *** //
router.get('/',
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  // get all chapters and associated lessons
  // for the sidebar and navbar
  chapterQueries.chaptersAndLessons()
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
    var renderObject = {
      title: 'Textbook LMS - dashboard',
      pageTitle: 'Dashboard',
      user: req.user,
      sortedChapters: sortedChapters,
      completed: percentage,
      messages: req.flash('messages')
    };
    return res.render('dashboard', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
