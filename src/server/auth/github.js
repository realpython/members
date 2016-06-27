var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var knex = require('../db/knex');

var githubConfig = {
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.callbackURL
};

passport.use(new GitHubStrategy(githubConfig,
  function(accessToken, refreshToken, profile, done) {
    knex('users').where('github_id', profile.id)
    .then(function(user) {
      if (user.length) {
        done(null, user[0]);
      } else {
        var email = profile._json.email || null;
        var displayName = profile.displayName || profile.username;
        return knex('users').insert({
          username: profile.username,
          github_id: profile.id,
          display_name: displayName,
          email: email,
          access_token: accessToken
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
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  knex('users').where('id', id)
  .then(function(user) {
    done(null, user[0]);
  })
  .catch(function(err) {
    done(err);
  });
});

module.exports = passport;
