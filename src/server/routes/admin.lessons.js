var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var lessonQueries = require('../db/queries.lessons');

// *** get all lessons *** //
router.get('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Admin', 'Lessons'];
  // get all chapters
  return lessonQueries.getLessons()
  .then(function(lessons) {
    var renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Lessons',
      user: req.user,
      lessons: lessons,
      breadcrumbs: breadcrumbs,
      messages: req.flash('messages')
    };
    return res.render('admin/lessons', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

module.exports = router;
