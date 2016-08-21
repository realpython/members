var express = require('express');
var router = express.Router();

var githubAuth = require('../auth/github');
var authHelpers = require('../auth/helpers');
var userQueries = require('../db/queries.users');
var codeQueries = require('../db/queries.codes');

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
  authHelpers.ensureVerified,
  authHelpers.ensureAuthenticated,
  function(req, res, next) {
  req.logout();
  var renderObject = {
    title: 'Textbook LMS - inactive',
    messages: req.flash('messages')
  };
  res.render('inactive');
});

// *** unverified user *** //
router.get('/verify',
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  var renderObject = {
    title: 'Textbook LMS - verify',
    messages: req.flash('messages')
  };
  if (parseInt(process.env.CAN_VERIFY) === 1) {
    res.render('unverified', renderObject);
  } else {
    res.render('closed', renderObject);
  }
});

// *** verify user *** //
router.post('/verify',
  authHelpers.ensureAuthenticated,
  authHelpers.ensureActive,
  function(req, res, next) {
  // TODO: refactor!
  // TODO: add server-side validation
  if (parseInt(process.env.CAN_VERIFY) === 1) {
    var registrationCode = req.body.code;
    var userID = parseInt(req.user.id);
    // check if code is valid
    return codeQueries.getCodeFromVerifyCode(registrationCode)
    .then(function(code) {
      if (!code.length) {
        req.flash('messages', {
          status: 'danger',
          value: 'Sorry. That code is not correct.'
        });
        return res.redirect('/auth/verify');
      }
      if (code[0].used) {
        req.flash('messages', {
          status: 'danger',
          value: 'Sorry. That code is not correct.'
        });
        return res.redirect('/auth/verify');
      }
      var codeFromDB = code[0].verify_code;
      if (codeFromDB === registrationCode) {
        if (req.user.verified) {
          req.flash('messages', {
            status: 'success',
            value: 'User verified.'
          });
          return res.redirect('/');
        }
        return userQueries.verifyUser(userID, codeFromDB)
        .then(function(user) {
          // update code
          return codeQueries.updateCodeFromVerifyCode(codeFromDB)
          .then(function(updatedCode) {
            if (updatedCode.length) {
              // update user
              var updateObject = {
                verify_code: codeFromDB
              };
              return userQueries.updateUser(userID, updateObject)
              .then(function(updatedUser) {
                if (updatedUser.length) {
                  req.flash('messages', {
                    status: 'success',
                    value: 'User verified.'
                  });
                  return res.redirect('/');
                }
              })
              .catch(function(err) {
                return next(err);
              });
            } else {
              req.flash('messages', {
                status: 'danger',
                value: 'Sorry. That code is not correct.'
              });
              return res.redirect('/auth/verify');
            }
          });
        })
        .catch(function(err) {
          return next(err);
        });
      } else {
        req.flash('messages', {
          status: 'danger',
          value: 'Sorry. That code is not correct.'
        });
        return res.redirect('/auth/verify');
      }
    })
    .catch(function(err) {
      return next(err);
    });
  } else {
    req.flash('messages', {
      status: 'danger',
      value: 'Sorry. You cannot verify at this time.'
    });
    return res.redirect('/auth/verify');
  }
});

module.exports = router;
