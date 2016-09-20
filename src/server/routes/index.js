const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/helpers');
const userQueries = require('../db/queries/users');
const routeHelpers = require('./_helpers');

// *** sanity check *** //
router.get(
  '/ping',
  getPing
);

// *** dashboard *** //
router.get(
  '/',
  authHelpers.ensureAuthenticated,
  authHelpers.ensureVerified,
  authHelpers.ensureActive,
  getDashboard
);

function getPing(req, res, next) {
  res.send('pong!');
}

function getDashboard(req, res, next) {
  const userID = parseInt(req.user.id);
  routeHelpers.getSideBarData(userID, (err, data) => {
    if (err) return next(err);
    const renderObject = {
      title: 'Textbook LMS - dashboard',
      pageTitle: 'Dashboard',
      user: req.user,
      sortedChapters: data.sortedChapters,
      completed: data.percentage,
      completeNum: (data.completed).length,
      completedArray: data.completed,
      feed: data.messageFeedData,
      totalLessons: (data.totalActiveLessons).length,
      totalUsers: (data.totalUsers[0]).count,
      messages: req.flash('messages')
    };
    if (req.user.admin) {
      if (parseInt(process.env.CAN_VERIFY) === 1) {
        renderObject.verify = true;
      }
    }
    return res.render('index', renderObject);
  });
}

module.exports = router;
