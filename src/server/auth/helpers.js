(function() {

  'use strict';


  const knex = require('../db/connection');
  const userQueries = require('../db/queries.users');
  const lessonQueries = require('../db/queries.lessons');
  const usersLessonsQueries = require('../db/queries.users_lessons');

  // TODO: combine ensureAuthenticated() and ensureVerified() by setting up global permission logic config

  function githubCallback(accessToken, refreshToken, profile, done) {
    // does the user already exist?
    userQueries.getSingleUserByGithubID(profile.id, (err, user) => {
      if (err) {
        done(err);
      }
      // yes?
      if (user.length) {
        done(null, user[0]);
      } else {
        // no? => add the new user
        const newUserObject = {};
        newUserObject.github_username = profile.username;
        newUserObject.github_id = parseInt(profile.id);
        newUserObject.github_display_name = profile.displayName || profile.username;
        newUserObject.github_access_token = accessToken;
        newUserObject.github_avatar = profile._json.avatar_url || 'https://avatars.io/static/default_128.jpg';
        newUserObject.email = profile._json.email || null;
        lessonQueries.addUser(newUserObject, (err, response) => {
          if (err) done(err);
          const newUser = response[0];
          // update users_lessons join table
          usersLessonsQueries.addNewUser(
            parseInt(newUser.id), (err, res) => {
            if (err) done(err);
            done(null, newUser);
          });
        });
      }
    });
  }

  function ensureAuthenticated(req, res, next) {
    if (req.user) {
      const userID = parseInt(req.user.id);
      userQueries.getSingleUserByID(userID, (err, user) => {
        if (err) return next(err);
        if (user.length && parseInt(user[0].id) === userID) {
          return next();
        } else {
          return next('User does not exist.');
        }
      });
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'You need to sign in before continuing.'
      });
      return res.redirect('/auth/log_in');
    }
  }

  function ensureVerified(req, res, next) {
    if (req.user) {
      if (req.user.verified) {
        const userID = parseInt(req.user.id);
        userQueries.getSingleUserByID(userID, (err, user) => {
          if (err) return next(err);
          if (user.length && parseInt(user[0].id) === userID) {
            if (
              user[0].verified &&
              user[0].verify_code === req.user.verify_code
            ) {
              return next();
            } else {
              return next('Verification code is incorrect.');
            }
          } else {
            return next('User does not exist.');
          }
        });
      } else {
        req.flash('messages', {
          status: 'danger',
          value: 'You need to verify before continuing.'
        });
        return res.redirect('/auth/verify');
      }
    } else {
      req.flash('messages', {
        status: 'danger',
        value: 'You need to sign in before continuing.'
      });
      return res.redirect('/auth/log_in');
    }
  }

  function ensureActive(req, res, next) {
    if (req.user.active) return next();
    req.flash('messages', {
      status: 'danger',
      value: 'Your account is inactive.'
    });
    return res.redirect('/auth/inactive');
  }

  function ensureAdmin(req, res, next) {
    if (req.user) {
      if (req.user.admin) {
        const userID = parseInt(req.user.id);
        // return next();
        return userQueries.getSingleUser(userID)
        .then((user) => {
          if (
            user.length &&
            parseInt(user[0].id) === parseInt(userID) &&
            user[0].admin
          ) {
            return next();
          } else {
            return next('User does not exist.');
          }
        });
      } else {
        req.flash('messages', {
          status: 'danger',
          value: 'You do not have permission to view that page.'
        });
        return res.redirect('/');
    }
    }
    req.flash('messages', {
      status: 'danger',
      value: 'You need to sign in before continuing.'
    });
    return res.redirect('/auth/log_in');
  }

  function loginRedirect(req, res, next) {
    if (req.user) return res.redirect('/');
    return next();
  }

  module.exports = {
    ensureAuthenticated,
    ensureVerified,
    ensureActive,
    ensureAdmin,
    loginRedirect,
    githubCallback
  };

}());
