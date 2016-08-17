var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var knex = require('../db/knex');
var authHelpers = require('./helpers');

var githubConfig = {
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.callbackURL
};

passport.use(new GitHubStrategy(
  githubConfig, authHelpers.githubCallback));

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
