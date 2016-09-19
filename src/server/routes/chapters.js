const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/helpers');
const chapterQueries = require('../db/queries.chapters');
const routeHelpers = require('./_helpers');

// *** get single chapter *** //
router.get('/:id',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  getSingleChapter
);

function getSingleChapter(req, res, next) {
  const userID = parseInt(req.user.id);
  routeHelpers.getSideBarData(userID, (err, data) => {
    if (err) return next(err);
    // get single chapter info
    const singleChapter = (data.sortedChapters).filter((chapter) => {
      return parseInt(chapter.chapterID) === parseInt(req.params.id);
    });
    // render
    if (singleChapter.length) {
      const renderObject = {
        title: 'Textbook LMS - ' + singleChapter[0].chapterName,
        pageTitle: singleChapter[0].chapterName,
        user: req.user,
        sortedChapters: data.sortedChapters,
        completedArray: data.completed,
        singleChapter: singleChapter[0],
        messages: req.flash('messages')
      };
      return res.render('chapter', renderObject);
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That chapter does not exist.'
      });
      return res.redirect('/');
    }
  });
}

module.exports = router;
