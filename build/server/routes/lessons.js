var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var lessonQueries = require('../db/queries.lessons');
var userAndLessonQueries = require('../db/queries.users_lessons');
var messageQueries = require('../db/queries.messages');
var routeHelpers = require('./_helpers');

// TODO: refactor sql queries

// *** get single lesson *** //
router.get('/:id',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Chapters', 'Lessons'];
  var renderObject = {
    user: req.user,
    breadcrumbs: breadcrumbs,
    messages: req.flash('messages'),
    lessonRead: false
  };
  var lessonID = req.params.id;
  var userID = req.user.id;
  // get all side bar data
  routeHelpers.getSideBarData(userID)
  .then(function(data) {
    renderObject.sortedChapters = data.sortedChapters;
    renderObject.completedArray = data.completed;
    // get single lesson info
    return lessonQueries.getSingleLesson(parseInt(lessonID))
    .then(function(singleLesson) {
      if (singleLesson.length && singleLesson[0].active) {
        var lessonObject = singleLesson[0];
        // get all lessons
        return lessonQueries.getActiveLessons()
        .then(function(lessons) {
          renderObject.previousLesson = routeHelpers.getPrevLesson(
            lessonObject.lesson_order_number, lessons);
          renderObject.nextLesson = routeHelpers.getNextLesson(lessonObject.lesson_order_number, lessons);
          // get all associated messages, replies, and user info
          return messageQueries.messagesAndUsers(
            parseInt(lessonObject.id))
          .then(function(messages) {
            // check if lesson is read
            return userAndLessonQueries.getSingleLesson(
              parseInt(lessonID), parseInt(userID))
            .then(function(singeLesson) {
              if (singeLesson[0].lesson_read) {
                renderObject.lessonRead = true;
              } else {
                var lessonRead = false;
              }
              var totalCompletedLessons = lessons;
              // filter, reduce, and sort the results
              var parentMessages = routeHelpers.getParentMessages(messages);
              var formattedMessages = routeHelpers.getChildMessages(
                parentMessages, messages);
              renderObject.userMessages = formattedMessages;
              renderObject.title = 'Textbook LMS - ' + lessonObject.name;
              renderObject.pageTitle = lessonObject.name;
              renderObject.singleLesson = lessonObject;
              return res.render('lesson', renderObject);
            });
          });
        });
      } else {
        req.flash('messages', {
          status: 'danger',
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
router.post('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  // TODO: add try/catch or validation
  var chapterID = parseInt(req.body.chapter);
  var lessonID = parseInt(req.body.lesson);
  var userID = parseInt(req.user.id);
  var read = req.body.read;
  // toggle read status
  return userAndLessonQueries.findAndUpdateLessonReadStatus(
    lessonID, userID, read)
  .then(function(lesson) {
    if (lesson.length) {
      // get all lessons from associated chapter
      return lessonQueries.getLessonsFromChapterID(chapterID)
      .then(function(lessons) {
        req.flash('messages', {
          status: 'success',
          value: 'Status updated.'
        });
        return res.redirect('/');
      });
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That lesson does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    return res.status(500).render('error', {
      message: 'Something went wrong'
    });
  });
});

module.exports = router;
