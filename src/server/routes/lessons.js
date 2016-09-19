const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/helpers');
const chapterQueries = require('../db/queries.chapters');
const lessonQueries = require('../db/queries.lessons');
const userAndLessonQueries = require('../db/queries.users_lessons');
const messageQueries = require('../db/queries.messages');
const routeHelpers = require('./_helpers');

// *** get single lesson *** //
router.get('/:id',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  getSingleLesson
);

function getSingleLesson(req, res, next) {
  const breadcrumbs = ['Chapters', 'Lessons'];
  const lessonID = parseInt(req.params.id);
  const userID = parseInt(req.user.id);
  routeHelpers.getSideBarData(userID, (err, data) => {
    if (err) {
      return next(err);
    } else {
      // get single lesson info
      routeHelpers.getSingleLessonInfo(
        lessonID, userID, (err, renderObject) => {
        if (err) {
          return next(err);
        } else {
          renderObject.user = req.user;
          renderObject.breadcrumbs = breadcrumbs;
          renderObject.messages = req.flash('messages');
          renderObject.lessonRead = false;
          renderObject.sortedChapters = data.sortedChapters;
          renderObject.completedArray = data.completed;
          return res.render('lesson', renderObject);
        }
      });
    }
  });
}

// *** update lesson read status *** //
router.post('/',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  // TODO: add try/catch or validation
  const chapterID = parseInt(req.body.chapter);
  const lessonID = parseInt(req.body.lesson);
  const userID = parseInt(req.user.id);
  const read = req.body.read;
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
