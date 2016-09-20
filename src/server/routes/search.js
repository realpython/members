var express = require('express');
var router = express.Router();

var massiveInstance = require('../db/massive');
var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries/chapters');
var routeHelpers = require('./_helpers');

// *** search *** //
router.get('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  var userID = req.user.id;
  // get all side bar data
  routeHelpers.getSideBarData(userID)
  .then(function(data) {
    var renderObject = {
      title: 'Textbook LMS - search',
      pageTitle: 'Search',
      user: req.user,
      sortedChapters: data.sortedChapters,
      completedArray: data.completed,
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
