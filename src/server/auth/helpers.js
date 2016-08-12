var knex = require('../db/knex');
var userQueries = require('../db/queries.users');

function githubCallback(
  accessToken, refreshToken, profile, done) {
  knex('users').where('github_id', profile.id)
  .then(function(user) {
    if (user.length) {
      done(null, user[0]);
    } else {
      var email = profile._json.email || null;
      var displayName = profile.displayName || profile.username;
      var avatar = profile._json.avatar_url || 'https://avatars.io/static/default_128.jpg';
      return knex('users').insert({
        github_username: profile.username,
        github_id: profile.id,
        github_display_name: displayName,
        github_access_token: accessToken,
        github_avatar: avatar,
        email: email
      }).returning('*')
      .then(function(response) {
        done(null, response[0]);
      });
    }
  })
  .catch(function(err) {
    done(err);
  });
}

function ensureAuthenticated(req, res, next) {
  // check request header
  if (req.user) {
    // check database
    var userID = req.user.id;
    return userQueries.getSingleUser(parseInt(userID))
    .then(function(user) {
      if (
        user.length &&
        parseInt(user[0].id) === parseInt(userID)
      ) {
        return next();
      } else {
        // TODO: handle this error better
        res.status(403);
        res.json({
          message: 'User does not exist.'
        });
        return res;
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
  // check request header
  if (req.user) {
    // check request header
    if (req.user.verified) {
      // check database
      var userID = req.user.id;
      return userQueries.getSingleUser(parseInt(userID))
      .then(function(user) {
        if (
          user.length &&
          parseInt(user[0].id) === parseInt(userID)
        ) {
          return next();
        } else {
          // TODO: handle this error better
          res.status(403);
          res.json({
            message: 'User does not exist.'
          });
          return res;
        }
      });
    } else {
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
  // check request header
  if (req.user.active) {
    return next();
  } else {
    req.flash('messages', {
      status: 'danger',
      value: 'Your account is inactive.'
    });
    return res.redirect('/auth/inactive');
  }
}

function ensureAdmin(req, res, next) {
  // check request header
  if (req.user) {
    // check request header
    if (req.user.admin) {
      // check database
      var userID = req.user.id;
      return userQueries.getSingleUser(parseInt(userID))
      .then(function(user) {
        if (
          user.length &&
          parseInt(user[0].id) === parseInt(userID) &&
          user[0].admin
        ) {
          return next();
        } else {
          // TODO: handle this error better
          res.status(403);
          res.json({
            message: 'User does not exist.'
          });
          return res;
        }
      });
    }
  }
  req.flash('messages', {
    status: 'danger',
    value: 'You do not have permission to view that page.'
  });
  return res.redirect('/auth/log_in');
}

function loginRedirect(req, res, next) {
  if (req.user) {
    return res.redirect('/');
  } else {
    return next();
  }
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  ensureVerified: ensureVerified,
  ensureActive: ensureActive,
  ensureAdmin: ensureAdmin,
  loginRedirect: loginRedirect,
  githubCallback: githubCallback
};
