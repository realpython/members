const express = require('express');
const router = express.Router();

const authHelpers = require('../auth/helpers');
const chapterQueries = require('../db/queries/chapters');
const userQueries = require('../db/queries/users');
const routeHelpers = require('./_helpers');

// *** get user profile *** //
router.get('/:id/profile',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  getUserProfile
);

function getUserProfile(req, res, next) {
  const userID = parseInt(req.params.id);
  const renderObject = {
    title: 'Textbook LMS - user profile',
    pageTitle: 'User Profile',
    messages: req.flash('messages')
  };
  // get all side bar data
  routeHelpers.getSideBarData(userID, (err, data) => {
    if (err) return next(err);
    renderObject.sortedChapters = data.sortedChapters;
    renderObject.completedArray = data.completed;
    // get single user
    userQueries.getSingleUserByID(userID, (err, user) => {
      if (err) return next(err);
      if (user.length) {
        renderObject.user = user[0];
        return res.render('profile', renderObject);
      } else {
        req.flash('messages', {
          status: 'danger',
          value: 'That user does not exist.'
        });
        return res.redirect('/');
      }
    });
  });
}

// *** update user profile *** //
router.post('/:id/profile',
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  const userID = parseInt(req.params.id);
  const userObject = {
    github_display_name: req.body.displayName
  };
  return userQueries.updateUser(userID, userObject)
  .then(function(user) {
    if (user.length) {
      req.flash('messages', {
        status: 'success',
        value: 'Profile update.'
      });
      return res.redirect('/users/' + userID + '/profile');
    }
  })
  .catch(function(err) {
    return next(err);
  });
});

if (process.env.NODE_ENV === 'development' || 'testing') {
  // *** toggle admin status *** //
  router.put(
    '/:username/admin',
    toggleAdminStatus
  );

  // *** toggle active status *** //
  router.put(
    '/:username/active',
    toggleActiveStatus
  );
}

function toggleAdminStatus(req, res, next) {
  const update = req.body;
  if (!('admin' in req.body)) {
    res.status(403);
    res.json({
      message: 'You do not have permission to do that.'
    });
  } else {
    userQueries.getSingleUserByUsername(req.params.username, (err, user) => {
      if (err) {
        return next(err);
      } else if (user.length) {
        userQueries.makeAdmin(req.params.username, req.body.admin)
        .then(function(response) {
          return res.status(200).json({
            status: 'success',
            message: 'User admin status updated.'
          });
        });
      } else {
        return res.status(400).json({
          message: 'That user does not exist.'
        });
      }
    });
  }
}

function toggleActiveStatus(req, res, next) {
  const update = req.body;
  if (!('active' in req.body)) {
    res.status(403);
    res.json({
      message: 'You do not have permission to do that.'
    });
  } else {
    userQueries.getSingleUserByUsername(req.params.username, (err, user) => {
      if (err) {
        return next(err);
      } else if (user.length) {
        userQueries.makeActive(req.params.username, req.body.active)
        .then(function(response) {
          return res.status(200).json({
            status: 'success',
            message: 'User active status updated.'
          });
        });
      } else {
        return res.status(400).json({
          message: 'That user does not exist.'
        });
      }
    });
  }
}

module.exports = router;
