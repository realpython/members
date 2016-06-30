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
    return chapterQueries.getSingleChapter(parseInt(req.params.id))
    .then(function(singleChapter) {
      if (singleChapter.length) {
        var chapterObject = singleChapter[0];
        renderObject.previousChapter = routeHelpers.getPrevChapter(
          chapterObject.order, sortedChapters);
        renderObject.nextChapter = routeHelpers.getNextChapter(
          chapterObject.order, sortedChapters);
        renderObject.title = 'Textbook LMS - ' + chapterObject.name;
        renderObject.pageTitle = chapterObject.name;
        renderObject.singleChapter = chapterObject;
        return res.render('chapter', renderObject);
      } else {
        req.flash('messages', {
          status: 'success',
          value: 'Sorry. That chapter does not exist.'
        });
        return res.redirect('/');
      }
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** update chapter read status *** //
router.get('/:id/update', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var read = req.query.read;
  chapterQueries.updateChapterReadStatus(parseInt(req.params.id), read)
  .then(function() {
    req.flash('messages', {
      status: 'success',
      value: 'Status updated.'
    });
    return res.redirect('/');
  })
  .catch(function(err) {
    return res.status(500).render('error', {
      message: 'Something went wrong'
    });
  });
});

module.exports = router;
