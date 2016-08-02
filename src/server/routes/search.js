var express = require('express');
var router = express.Router();

var massiveInstance = require('../db/massive');
var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var routeHelpers = require('./_helpers');

// *** search *** //
router.get('/',
  authHelpers.ensureVerified,
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
    var renderObject = {
      title: 'Textbook LMS - search',
      pageTitle: 'Search',
      user: req.user,
      sortedChapters: sortedChapters,
      messages: req.flash('messages')
    };
    if ((req.query.term).length) {
      var searchOptions = {
        columns: ['content'],
        term: req.query.term || ''
      };
      massiveInstance.lessons.search(searchOptions, function(err, results) {
        if (results.length) {
          renderObject.results = results;
        }
        return res.render('search', renderObject);
      });
    } else {
      return res.render('search', renderObject);
    }
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
