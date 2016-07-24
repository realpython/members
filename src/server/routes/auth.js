var express = require('express');
var router = express.Router();

var githubAuth = require('../auth/github');
var authHelpers = require('../auth/helpers');

// *** authenticate with github *** //
router.get('/github',
  githubAuth.authenticate('github', {
    scope: ['user:email']
  })
);

// *** github callback *** //
router.get('/github/callback',
  githubAuth.authenticate('github', {
    failureRedirect: '/auth/sign_up'
  }),
  function(req, res, next) {
  req.flash('messages', {
    status: 'success',
    value: 'Welcome, friend!'
  });
  res.redirect('/');
});

// *** user log in *** //
router.get('/log_in',
  authHelpers.loginRedirect,
  function(req, res, next) {
  var renderObject = {
    title: 'Textbook LMS',
    pageTitle: 'Textbook LMS',
    user: req.user,
    messages: req.flash('messages')
  };
  res.render('log_in', renderObject);
});

// *** user log out *** //
router.get('/log_out',
  authHelpers.ensureAuthenticated,
  function(req, res, next) {
  req.logout();
  req.flash('messages', {
    status: 'success',
    value: 'You successfully logged out.'
  });
  res.redirect('/auth/log_in');
});

// *** inactive user *** //
router.get('/inactive',
  authHelpers.ensureAuthenticated,
  function(req, res, next) {
  req.logout();
  res.render('inactive');
});

module.exports = router;
