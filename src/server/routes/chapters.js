var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var chapterQueries = require('../db/queries.chapters');

router.get('/:id', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var renderObject = {
    user: req.user,
    messages: req.flash('messages')
  };
  // get all chapters
  chapterQueries.getChapters()
  .then(function(chapters) {
    renderObject.chapters = chapters;
    // get single chapter info
    chapterQueries.getSingleChapter(parseInt(req.params.id))
    .then(function(singleChapter) {
      if (singleChapter.length) {
        var chapterObject = singleChapter[0];
        renderObject.previousChapter = getPrevChapter(
          chapterObject.order, chapters);
        renderObject.nextChapter = getNextChapter(
          chapterObject.order, chapters);
        renderObject.title = 'Textbook LMS - ' + chapterObject.name;
        renderObject.pageTitle = chapterObject.name;
        renderObject.singleChapter = chapterObject;
        return res.render('chapter', renderObject);
      } else {
        req.flash('messages', {
          status: 'success',
          value: 'Sorry. That chapter does not exist.'
        });
        return res.redirect('/');
      }
    });
  })
  .catch(function(err) {
    return next(err);
  });
});

router.get('/:id/update', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  var read = req.query.read;
  chapterQueries.updateChapterReadStatus(parseInt(req.params.id), read)
  .then(function() {
    req.flash('messages', {
      status: 'success',
      value: 'Status updated.'
    });
    return res.redirect('/');
  })
  .catch(function(err) {
    return res.status(500).render('error', {
      message: 'Something went wrong'
    });
  });
});

// *** helpers ** //

function getPrevChapter(orderID, chapters) {
  return chapters.filter(function(chapter) {
    return chapter.order === parseInt(orderID - 1);
  });
}

function getNextChapter(orderID, chapters) {
  return chapters.filter(function(chapter) {
    return chapter.order === parseInt(orderID + 1);
  });
}

module.exports = router;
