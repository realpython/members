var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var lessonQueries = require('../db/queries.lessons');
var messageQueries = require('../db/queries.messages');
var routeHelpers = require('./_helpers');

// TODO: refactor sql queries

// *** get single lesson *** //
router.get('/:id', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Chapters', 'Lessons'];
  var renderObject = {
    user: req.user,
    breadcrumbs: breadcrumbs,
    messages: req.flash('messages')
  };
  // get all chapters and associated lessons
  // for the sidebar and navbar
  return chapterQueries.chaptersAndLessons()
  .then(function(results) {
    // filter, reduce, and sort the results
    var reducedResults = routeHelpers.reduceResults(results);
    var chapters = routeHelpers.convertArray(reducedResults);
    var sortedChapters = routeHelpers.sortLessonsByOrderNumber(chapters);
    renderObject.sortedChapters = sortedChapters;
    // get single lesson info
    return lessonQueries.getSingleLesson(parseInt(req.params.id))
    .then(function(singleLesson) {
      if (singleLesson.length) {
        var lessonObject = singleLesson[0];
        // get all lessons
        return lessonQueries.getLessons()
        .then(function(lessons) {
          renderObject.previousLesson = routeHelpers.getPrevLesson(
            lessonObject.lesson_order_number, lessons);
          renderObject.nextLesson = routeHelpers.getNextLesson(lessonObject.lesson_order_number, lessons);
          // get all associated messages and user info
          return messageQueries.messagesAndUsers(
            parseInt(lessonObject.id))
          .then(function(messages) {
            renderObject.userMessages = messages;
            renderObject.title = 'Textbook LMS - ' + lessonObject.name;
            renderObject.pageTitle = lessonObject.name;
            renderObject.singleLesson = lessonObject;
            return res.render('lesson', renderObject);
          });
        });
      } else {
        req.flash('messages', {
          status: 'success',
          value: 'Sorry. That lesson does not exist.'
        });
        return res.redirect('/');
      }
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** update lesson read status *** //
router.post('/', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  // TODO: add try/catch or validation
  var chapterID = parseInt(req.body.chapter);
  var lessonID = parseInt(req.body.lesson);
  var read = req.body.read;
  // toggle read status
  return lessonQueries.updateLessonReadStatus(lessonID, read)
  .then(function() {
    // get all lessons from associated chapter
    return lessonQueries.getLessonsFromChapterID(chapterID)
    .then(function(lessons) {
      // check chapter read status
      var chapterStatus = routeHelpers.getChapterReadStatus(lessons);
      // update chapter status
      return chapterQueries.updateChapterReadStatus(
        chapterID, chapterStatus)
      .then(function() {
        req.flash('messages', {
          status: 'success',
          value: 'Status updated.'
        });
        return res.redirect('/');
      });
    });
  })
  .catch(function(err) {
    return res.status(500).render('error', {
      message: 'Something went wrong'
    });
  });
});

module.exports = router;
