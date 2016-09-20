const express = require('express');
const router = express.Router();

const authHelpers = require('../../auth/helpers');
const lessonQueries = require('../../db/queries/lessons');
const chapterQueries = require('../../db/queries/chapters');
const userQueries = require('../../db/queries/users');
const lessonsUsersQueries = require('../../db/queries/users_lessons');
const routeHelpers = require('../_helpers');

// *** get all lessons *** //
router.get(
  '/',
  authHelpers.ensureAdmin,
  getAllLessons
);

// *** add new lesson *** //
router.post(
  '/',
  authHelpers.ensureAdmin,
  addNewLesson
);

function getAllLessons(req, res, next) {
  const breadcrumbs = ['Admin', 'Lessons'];
  lessonQueries.getAllLessons((err, lessons) => {
    if (err) next(err);
    chapterQueries.getChapters((err, chapters) => {
      if (err) next(err);
      const renderObject = {
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
  });
}

function addNewLesson(req, res, next) {
  // TODO: Add server side validation
  const payload = req.body;
  const chapterID = parseInt(payload.chapter);
  const lesson = {
    name: payload.name,
    content: payload.content,
    chapter_id: chapterID,
    active: false
  };
  routeHelpers.addNewLesson(lesson, (err, addedLesson) => {
    if (err) {
      return next(err);
    } else if(addedLesson) {
      if (addedLesson.length) {
        const addedLessonID = parseInt(addedLesson[0].id);
        userQueries.getUsers((err, users) => {
          if (err) return next(err);
          users.forEach((user) => {
            const newLessonObject = {
              user_id: user.id,
              lesson_id: addedLessonID
            };
            lessonsUsersQueries.addRow(newLessonObject, (err, results) => {
              if (err) return next(err);
            });
          });
          req.flash('messages', {
            status: 'success',
            value: 'Lesson added.'
          });
          return res.redirect('/admin/lessons');
        });
      } else {
        return next('Something went wrong!');
      }
    }
  });
}

// *** update lesson *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  const lessonID = parseInt(req.params.id);
  const payload = req.body;
  const lessonObject = {
    lesson_order_number: payload.lessonOrderNumber,
    chapter_order_number: payload.chapterOrderNumber,
    name: payload.lessonName,
    content: payload.lessonContent,
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
  const lessonID = parseInt(req.params.lessonID);
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

// *** get single lesson *** //
router.get(
  '/:id',
  authHelpers.ensureAdmin,
  getSingleLesson
);
function getSingleLesson(req, res, next) {
  const lessonID = parseInt(req.params.id);
  lessonQueries.getSingleLesson(lessonID, (err, lesson) => {
    if (err) {
      return next(err);
    } else if(lesson) {
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
    } else {
      return res.status(404).json({
        message: 'That lesson does not exist.'
      });
    }
  });
}

module.exports = router;
