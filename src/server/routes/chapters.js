var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var routeHelpers = require('./_helpers');

// *** get single chapter *** //
router.get('/:id', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var renderObject = {
    user: req.user,
    messages: req.flash('messages')
  };
  // get all chapters and associated lessons
  // for the sidebar and navbar
  chapterQueries.chaptersAndLessons()
  .then(function(results) {
    // filter, reduce, and sort the results
    var reducedResults = routeHelpers.reduceResults(results);
    var chapters = routeHelpers.convertArray(reducedResults);
    var sortedChapters = routeHelpers.sortLessonsByOrderNumber(chapters);
    renderObject.sortedChapters = sortedChapters;
    // get single chapter info
    var singleChapter = sortedChapters.filter(function(chapter) {
      return parseInt(chapter.chapterID) === parseInt(req.params.id);
    });
    // render
    if (singleChapter.length) {
      var chapterObject = singleChapter[0];
      renderObject.previousChapter = routeHelpers.getPrevChapter(
        chapterObject.chapterOrder, sortedChapters);
      renderObject.nextChapter = routeHelpers.getNextChapter(
        chapterObject.chapterOrder, sortedChapters);
      renderObject.title = 'Textbook LMS - ' + chapterObject.chapterName;
      renderObject.pageTitle = chapterObject.chapterName;
      renderObject.singleChapter = chapterObject;
      return res.render('chapter', renderObject);
    } else {
      req.flash('messages', {
        status: 'success',
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
