var express = require('express');
var router = express.Router();

var authHelpers = require('../../auth/helpers');
var chapterQueries = require('../../db/queries.chapters');
var lessonQueries = require('../../db/queries.lessons');

// *** get all chapters *** //
router.get('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Admin', 'Chapters'];
  // get all chapters
  return chapterQueries.getChapters()
  .then(function(chapters) {
    var renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Chapters',
      user: req.user,
      chapters: chapters,
      breadcrumbs: breadcrumbs,
      messages: req.flash('messages')
    };
    return res.render('admin/chapters', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** get single chapter *** //
router.get('/:id',
authHelpers.ensureAdmin,
function(req, res, next) {
  var chapterID = parseInt(req.params.id);
  return chapterQueries.getSingleChapter(chapterID)
  .then(function(chapter) {
    if (chapter.length) {
      return res.status(200).json({
        status: 'success',
        data: chapter[0]
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

// *** add new chapter *** //
router.post('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var chapter = {
    order_number: payload.orderNumber,
    name: payload.name,
    active: payload.active || false
  };
  return chapterQueries.addChapter(chapter)
  .then(function(response) {
    if (response.length) {
      req.flash('messages', {
        status: 'success',
        value: 'Chapter added.'
      });
    }
    return res.redirect('/admin/chapters');
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// *** update chapter *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var chapterID = parseInt(req.params.id);
  var payload = req.body;
  var chapterObject = {
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
  var chapterID = parseInt(req.params.chapterID);
  return chapterQueries.deactivateChapter(chapterID)
  .then(function(chapter) {
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
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
