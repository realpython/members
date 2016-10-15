const express = require('express');
const router = express.Router();

const authHelpers = require('../../auth/helpers');
const chapterQueries = require('../../db/queries/chapters');
const lessonQueries = require('../../db/queries/lessons');

// *** get all chapters *** //
router.get(
  '/',
  authHelpers.ensureAdmin,
  getAllChapters
);

// *** get single chapter *** //
router.get(
  '/:id',
  authHelpers.ensureAdmin,
  getSingleChapter
);

// *** add new chapter *** //
router.post(
  '/',
  authHelpers.ensureAdmin,
  addNewChapter
);

function getAllChapters(req, res, next) {
  // get breadcrumbs
  const breadcrumbs = ['Admin', 'Chapters'];
  // get all chapters
  return chapterQueries.getChapters((err, chapters) => {
    if (err) return next(err);
    const renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Chapters',
      user: req.user,
      chapters: chapters,
      breadcrumbs: breadcrumbs,
      messages: req.flash('messages')
    };
    return res.render('admin/chapters', renderObject);
  });
}


function getSingleChapter(req, res, next) {
  const chapterID = parseInt(req.params.id);
  chapterQueries.getSingleChapterFromID(chapterID, (err, chapter) => {
    if (err) {
      return res.status(500).json({
        message: 'Something went wrong.'
      });
    } else {
      if (chapter.length) {
        return res.status(200).json({
          status: 'success',
          data: chapter[0]
        });
      } else {
        return res.status(404).json({
          message: 'That chapter does not exist.'
        });
      }
    }
  });
}

function addNewChapter(req, res, next) {
  // TODO: Add server side validation
  const payload = req.body;
  const chapter = {
    order_number: payload.orderNumber,
    name: payload.name,
    active: payload.active || false
  };
  chapterQueries.addChapter(chapter, (err, chapter) => {
    if(err) {
      return next(err);
    }
    if (chapter.length) {
      req.flash('messages', {
        status: 'success',
        value: 'Chapter added.'
      });
      return res.redirect('/admin/chapters');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry, that chapter does not exist.'
      });
      return res.redirect('/admin/chapters');
    }
  });
}

// *** update chapter *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  const chapterID = parseInt(req.params.id);
  const payload = req.body;
  const chapterObject = {
    order_number: parseInt(payload.chapterOrderNumber),
    name: payload.chapterName,
    active: payload.chapterActive
  };
  return chapterQueries.updateChapter(chapterID, chapterObject)
  .then(function(chapter) {
    if (chapter.length) {
      return res.status(200).json({
        status: 'success',
        message: 'Chapter updated.'
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

// *** deactivate chapter *** //
router.get('/:chapterID/deactivate', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  const chapterID = parseInt(req.params.chapterID);
  return chapterQueries.deactivateChapter(chapterID, (err, chapter) => {
    if (chapter.length) {
      return lessonQueries.deactivateLessonsFromChapterID(chapterID)
      .then(function(lessons) {
        req.flash('messages', {
          status: 'success',
          value: 'Chapter deactivated.'
        });
        return res.redirect('/admin/chapters');
      });
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That chapter does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    console.log(err);
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
