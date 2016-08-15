var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var routeHelpers = require('./_helpers');

// *** get single chapter *** //
router.get('/:id',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  var renderObject = {
    user: req.user,
    messages: req.flash('messages')
  };
  var userID = req.user.id;
  // get all side bar data
  routeHelpers.getSideBarData(userID)
  .then(function(data) {
    renderObject.sortedChapters = data.sortedChapters;
    renderObject.completedArray = data.completed;
    // get single chapter info
    var singleChapter = (data.sortedChapters).filter(function(chapter) {
      return parseInt(chapter.chapterID) === parseInt(req.params.id);
    });
    // render
    if (singleChapter.length) {
      var chapterObject = singleChapter[0];
      renderObject.title = 'Textbook LMS - ' + chapterObject.chapterName;
      renderObject.pageTitle = chapterObject.chapterName;
      renderObject.singleChapter = chapterObject;
      return res.render('chapter', renderObject);
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That chapter does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
