var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var userQueries = require('../db/queries.users');

// *** get all users *** //
router.get('/users', authHelpers.ensureAdmin,
function(req, res, next) {
  // get all users
  return userQueries.getUsers()
  .then(function(users) {
    var renderObject = {
      title: 'Textbook LMS - admin',
      pageTitle: 'Users',
      user: req.user,
      users: users,
      messages: req.flash('messages')
    };
    return res.render('admin/users', renderObject);
  })
  .catch(function(err) {
    return next(err);
  });
});

// *** add new user *** //
router.post('/users', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var user = {
    github_username: payload.githubUsername,
    github_id: payload.githubID,
    github_display_name: payload.githubDisplayName,
    github_access_token: payload.githubToken,
    email: payload.email,
    admin: payload.admin || false,
    verified: payload.verified || false
  };
  return userQueries.addUser(user)
  .then(function(response) {
    if (response.length) {
      req.flash('messages', {
        status: 'success',
        value: 'User added.'
      });
      return res.redirect('/admin/users');
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'Something went wrong.'
      });
      return res.redirect('/admin/users');
    }
  })
  .catch(function(err) {
    // TODO: be more specific with the errors
    return next(err);
  });
});

module.exports = router;
