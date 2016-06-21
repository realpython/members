var express = require('express');
var router = express.Router();

var githubAuth = require('../auth/github');
var authHelpers = require('../auth/helpers');

router.get('/github',
  githubAuth.authenticate('github', {
    scope: ['user:email']
  })
);

router.get('/github/callback',
  githubAuth.authenticate('github', {
    failureRedirect: '/auth/sign_up'
  }),
  function(req, res, next) {
  req.flash('messages', {
    status: 'warning',
    value: 'Welcome!'
  });
  res.redirect('/');
});

router.get('/log_in', authHelpers.loginRedirect,
  function(req, res, next) {
  var renderObject = {
    title: 'Textbook LMS',
    user: req.user,
    messages: req.flash('messages')
  };
  res.render('log_in', renderObject);
});

router.get('/log_out', authHelpers.ensureAuthenticated,
  function(req, res, next) {
  req.logout();
  req.flash('messages', {
    status: 'warning',
    value: 'You successfully logged out.'
  });
  res.redirect('/auth/log_in');
});

module.exports = router;
