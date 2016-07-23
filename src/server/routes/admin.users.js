var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var userQueries = require('../db/queries.users');

// *** get all users *** //
router.get('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // get breadcrumbs
  var breadcrumbs = ['Admin', 'Users'];
  // get all users
  return userQueries.getUsers()
  .then(function(users) {
    var renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Users',
      user: req.user,
      users: users,
      breadcrumbs: breadcrumbs,
      messages: req.flash('messages')
    };
    return res.render('admin/users', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** get single users *** //
router.get('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  var userID = parseInt(req.params.id);
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

// *** add new user *** //
router.post('/', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var user = {
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
  return userQueries.addUser(user)
  .then(function(response) {
    if (response.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User added.'
      });
    }
    return res.redirect('/admin/users');
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

// *** update user *** //
router.put('/:id', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var userID = parseInt(req.params.id);
  var payload = req.body;
  var userObject = {
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
  var userID = parseInt(req.params.userID);
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
        status: 'success',
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
