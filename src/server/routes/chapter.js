var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');
var lessonQueries = require('../db/queries.lessons');

router.get('/:id', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var renderObject = {
    user: req.user,
    messages: req.flash('messages')
  };
  // get all chapters for the sidebar
  chapterQueries.getChapters()
  .then(function(chapters) {
    renderObject.chapters = chapters;
    // get single chapter info
    return chapterQueries.getSingleChapter(parseInt(req.params.id))
    .then(function(singleChapter) {
      if (singleChapter.length) {
        renderObject.title = 'Textbook LMS - ' + singleChapter[0].name;
        renderObject.singleChapter = singleChapter[0];
        res.render('chapter', renderObject);
      } else {
        req.flash('messages', {
          status: 'danger',
          value: 'Sorry. That chapter does not exist.'
        });
        return res.redirect('/');
      }
    });
  })
  .catch(function(err) {
    next(err);
  });
});

module.exports = router;
