const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const knex = require('../db/knex');
const authHelpers = require('./helpers');
const init = require('./init');

const githubConfig = {
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.callbackURL
};

passport.use(new GitHubStrategy(githubConfig, authHelpers.githubCallback));

init();

module.exports = passport;
