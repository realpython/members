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
router.get('/', authHelpers.ensureAuthenticated,
function(req, res, next) {
  // get all chapters and associated lessons
  chapterQueries.chaptersAndLessons()
  .then(function(results) {
    // filter and reduce the results
    var reducedResults = routeHelpers.reduceResults(results);
    var chaptersAndLessons = routeHelpers.convertArray(reducedResults);
    // get completed chapters
    var completed = routeHelpers.getCompletedChapters(
      chaptersAndLessons).length;
    var renderObject = {
      title: 'Textbook LMS - dashboard',
      pageTitle: 'Dashboard',
      user: req.user,
      chaptersAndLessons: chaptersAndLessons,
      completed: ((completed / chaptersAndLessons.length) * 100).toFixed(0),
      messages: req.flash('messages')
    };
    return res.render('dashboard', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
