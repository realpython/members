var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var knex = require('../db/knex');

passport.use(new GitHubStrategy({
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    knex('users').where('email', profile.emails[0].value)
    .then(function(user) {
      if(user.length) {
        done(null, user[0]);
      } else {
        var email = '';
        if(profile.emails) {
          email = profile.emails[0].value;
        }
        knex('users').insert({
          username: profile.username,
          display_name: profile.displayName,
          email: email,
          access_token: accessToken
        }).returning('*')
        .then(function(user) {
          done(null, user[0]);
        });
      }
    })
    .catch(function(err) {
      callback(err);
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