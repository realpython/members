var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var lessonQueries = require('../db/queries.lessons');
var chapterQueries = require('../db/queries.chapters');
var routeHelpers = require('./_helpers');

// *** get all lessons *** //
router.get('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Admin', 'Lessons'];
  // get all lessons
  return lessonQueries.getLessons()
  .then(function(lessons) {
    // get all chapters
    return chapterQueries.getChapters()
    .then(function(chapters) {
      var renderObject = {
        title: 'Textbook LMS - admin',
        pageTitle: 'Lessons',
        user: req.user,
        lessons: lessons,
        chapters: chapters,
        breadcrumbs: breadcrumbs,
        messages: req.flash('messages')
      };
      return res.render('admin/lessons', renderObject);
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** add new lesson *** //
router.post('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var chapterID = parseInt(payload.chapter);
  var lesson = {
    name: payload.name,
    content: payload.content,
    chapter_id: chapterID,
    active: false
  };
  // get lesson order numbers
  return lessonQueries.getLessonOrderNumbers()
  .then(function(lessonOrders) {
    var lessonOrderNum = routeHelpers.getNextLessonOrderNum(lessonOrders);
    lesson.lesson_order_number = parseInt(lessonOrderNum);
    // get lessons from associated chapter
    return lessonQueries.getLessonChapterOrderNumsFromChapterID(chapterID)
    .then(function(lessons) {
      var chapterOrderNum = routeHelpers.getNextChapterOrderNum(lessons);
      lesson.chapter_order_number = parseInt(chapterOrderNum);
      return lessonQueries.addLesson(lesson)
      .then(function(response) {
        if (response.length) {
          req.flash('messages', {
            status: 'success',
            value: 'Lesson added.'
          });
        }
        return res.redirect('/admin/lessons');
      });
    });
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
