var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var suggestionQueries = require('../db/queries.suggestions');
var routeHelpers = require('./_helpers');

// *** suggestions *** //
router.get(
  '/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  getSuggestions
);

function getSuggestions(req, res, next) {
  var userID = parseInt(req.user.id);
  // get all side bar data
  routeHelpers.getSideBarData(userID, (err, data) => {
    if (err) return next(err);
    // get suggested topics
    suggestionQueries.getAllSuggestions()
    .then(function(suggestions) {
      var renderObject = {
        title: 'Textbook LMS - contact',
        pageTitle: 'Suggestions',
        user: req.user,
        sortedChapters: data.sortedChapters,
        completedArray: data.completed,
        suggestions: suggestions,
        messages: req.flash('messages')
      };
      return res.render('suggestions', renderObject);
    });
  })
  .catch(function(err) {
    return next(err);
  });
}

router.post('/',
  authHelpers.ensureVerified,
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
