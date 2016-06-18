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
    failureRedirect: '/'
  }),
  function(req, res, next) {
  req.flash('messages', {
    status: 'success',
    value: 'Welcome!'
  });
  res.redirect('/dashboard');
});

router.get('/logout', authHelpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  req.flash('messages', {
    status: 'success',
    value: 'You successfully logged out. Congrats!'
  });
  res.redirect('/');
});

module.exports = router;
