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
  return lessonQueries.getAllLessons()
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

// *** get single lesson *** //
router.get('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  var lessonID = parseInt(req.params.id);
  return lessonQueries.getSingleLesson(lessonID)
  .then(function(lesson) {
    if (lesson.length) {
      return res.status(200).json({
        status: 'success',
        data: lesson[0]
      });
    } else {
      return res.status(500).json({
        message: 'Something went wrong.'
      });
    }
  })
  .catch(function(err) {
    return res.status(500).json({
      message: 'Something went wrong.'
    });
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

// *** update lesson *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var lessonID = parseInt(req.params.id);
  var payload = req.body;
  var lessonObject = {
    lesson_order_number: payload.lessonOrderNumber,
    chapter_order_number: payload.chapterOrderNumber,
    name: payload.lessonName,
    content: payload.lessonContent,
    read: payload.lessonRead,
    active: payload.lessonActive,
    chapter_id: payload.chapter
  };
  return lessonQueries.updateLesson(lessonID, lessonObject)
  .then(function(lesson) {
    if (lesson.length) {
      return res.status(200).json({
        status: 'success',
        message: 'Lesson updated.'
      });
    } else {
      return res.status(500).json({
        message: 'Something went wrong.'
      });
    }
  })
  .catch(function(err) {
    return res.status(500).json({
      message: 'Something went wrong.'
    });
  });
});

// *** deactivate lesson *** //
router.get('/:lessonID/deactivate', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var lessonID = parseInt(req.params.lessonID);
  return lessonQueries.deactivateLesson(lessonID)
  .then(function(lesson) {
    if (lesson.length) {
      req.flash('messages', {
        status: 'success',
        value: 'Lesson deactivated.'
      });
      return res.redirect('/admin/lessons');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That lesson does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
