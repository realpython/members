var knex = require('../db/knex');

function githubCallback(
  accessToken, refreshToken, profile, done) {
  knex('users').where('github_id', profile.id)
  .then(function(user) {
    if (user.length) {
      done(null, user[0]);
    } else {
      var email = profile._json.email || null;
      var displayName = profile.displayName || profile.username;
      return knex('users').insert({
        github_username: profile.username,
        github_id: profile.id,
        github_display_name: displayName,
        github_access_token: accessToken,
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
  if (req.user) {
    return next();
  } else {
    req.flash('messages', {
      status: 'danger',
      value: 'You need to sign in before continuing.'
    });
    return res.redirect('/auth/log_in');
  }
}

function ensureVerified(req, res, next) {
  if (req.user.verified) {
    return next();
  } else {
    req.flash('messages', {
      status: 'danger',
      value: 'Please verify your account.'
    });
    return res.redirect('/auth/log_in');
  }
}

function ensureAdmin(req, res, next) {
  if (req.user) {
    if (req.user.admin) {
      return next();
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
  ensureAdmin: ensureAdmin,
  loginRedirect: loginRedirect,
  githubCallback: githubCallback
};
