const express = require('express');
const router = express.Router();

const authHelpers = require('../../auth/helpers');
const routeHelpers = require('../_helpers');
const userQueries = require('../../db/queries/users');
const lessonQueries = require('../../db/queries/lessons');
const lessonsUsersQueries = require('../../db/queries/users_lessons');

// *** get all users *** //
router.get(
  '/',
  authHelpers.ensureAdmin,
  getAllUsers
);
// *** add new user *** //
router.post(
  '/',
  authHelpers.ensureAdmin,
  addNewUser
);

function getAllUsers(req, res, next) {
  const breadcrumbs = ['Admin', 'Users'];
  userQueries.getUsers((err, users) => {
    if (err) return next(err);
    const renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Users',
      user: req.user,
      users: users,
      breadcrumbs: breadcrumbs,
      messages: req.flash('messages')
    };
    return res.render('admin/users', renderObject);
  });
}

// *** get single user *** //
router.get('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  const userID = parseInt(req.params.id);
  return userQueries.getSingleUser(userID)
  .then(function(user) {
    if (user.length) {
      return res.status(200).json({
        status: 'success',
        data: user[0]
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

function addNewUser(req, res, next) {
  // TODO: Add server side validation
  const payload = req.body;
  const userObject = {
    github_username: payload.githubUsername,
    github_id: payload.githubID,
    github_display_name: payload.githubDisplayName,
    github_access_token: payload.githubToken,
    github_avatar: payload.githubAvatar || 'https://avatars.io/static/default_128.jpg',
    email: payload.email,
    admin: payload.admin || false,
    verified: payload.verified || false,
    active: payload.active || true
  };
  routeHelpers.addNewUser(userObject, (err, user) => {
    if(err) return next(err);
    if (user.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User added.'
      });
      return res.redirect('/admin/users');
    }
  });
}

// *** update user *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  const userID = parseInt(req.params.id);
  const payload = req.body;
  const userObject = {
    github_username: payload.githubUsername,
    github_id: payload.githubID,
    github_display_name: payload.githubDisplayName,
    github_access_token: payload.githubToken,
    github_avatar: payload.githubAvatar,
    email: payload.email,
    admin: payload.admin,
    verified: payload.verified,
    active: payload.active
  };
  return userQueries.updateUser(userID, userObject)
  .then(function(user) {
    if (user.length) {
      return res.status(200).json({
        status: 'success',
        message: 'User updated.'
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

// *** deactivate user *** //
router.get('/:userID/deactivate', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  const userID = parseInt(req.params.userID);
  return userQueries.deactivateUser(userID)
  .then(function(user) {
    if (user.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User deactivated.'
      });
      return res.redirect('/admin/users');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That user does not exist.'
      });
      return res.redirect('/');
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// *** unverify user *** //
router.get('/:userID/unverify', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  const userID = parseInt(req.params.userID);
  return userQueries.unverifyUser(userID)
  .then(function(user) {
    if (user.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User unverified.'
      });
      return res.redirect('/admin/users');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Sorry. That user does not exist.'
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
