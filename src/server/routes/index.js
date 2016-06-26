var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');

router.get('/ping', function(req, res, next) {
  res.send('pong!');
});

router.get('/', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  chapterQueries.getChapters()
  .then(function(chapters) {
    var completed = getCompleted(chapters).length;
    var renderObject = {
      title: 'Textbook LMS - dashboard',
      pageTitle: 'Dashboard',
      user: req.user,
      chapters: chapters,
      completed: ((completed / chapters.length) * 100).toFixed(0),
      messages: req.flash('messages')
    };
    res.render('dashboard', renderObject);
  })
  .catch(function(err) {
    next(err);
  });
});

// *** helpers ** //

function getCompleted(chapters) {
  return chapters.filter(function(chapter) {
    return chapter.read;
  });
}

module.exports = router;
