var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.githubClientID,
  clientSecret: process.env.githubClientSecret,
  callbackURL: process.env.callbackURL
  }, function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (!err) {
      done(null, user);
    } else {
      done(err, null);
    }
  });
});

module.exports = passport;