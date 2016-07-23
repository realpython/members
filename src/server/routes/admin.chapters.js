var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');

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

// *** add new chapter *** //
router.post('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var chapter = {
    order_number: payload.orderNumber,
    name: payload.name
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

module.exports = router;
