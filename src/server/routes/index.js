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
    var renderObject = {
      title: 'Textbook LMS - dashboard',
      user: req.user,
      chapters: chapters,
      messages: req.flash('messages')
    };
    res.render('dashboard', renderObject);
  })
  .catch(function(err) {
    next(err);
  });
});

module.exports = router;
