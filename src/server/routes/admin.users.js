var express = require('express');
var router = express.Router();

var authHelpers = require('../auth/helpers');
var userQueries = require('../db/queries.users');

router.get('/users', authHelpers.ensureAdmin,
function(req, res, next) {
  // get all users
  userQueries.getUsers()
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

// add new user
router.post('/users', authHelpers.ensureAdmin,
function(req, res, next) {
  // TODO: Add server side validation
  var payload = req.body;
  var user = {
    username: payload.username,
    github_id: payload.githubID,
    display_name: payload.displayName,
    email: payload.email,
    access_token: payload.token,
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
