var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var suggestionQueries = require('../db/queries.suggestions');
var routeHelpers = require('./_helpers');

// *** suggestions *** //
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
    var renderObject = {
      title: 'Textbook LMS - contact',
      pageTitle: 'Suggestions',
      user: req.user,
      sortedChapters: sortedChapters,
      messages: req.flash('messages')
    };
    return res.render('suggestions', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

router.post('/',
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  var suggestionObject = {
    title: req.body.title,
    description: req.body.description,
    user_id: parseInt(req.user.id)
  };
  return suggestionQueries.addSuggestion(suggestionObject)
  .then(function(response) {
    if (response.length) {
      req.flash('messages', {
        status: 'success',
        value: 'Suggestion added.'
      });
    }
    return res.redirect('/suggestions');
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
