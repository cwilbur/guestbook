var passport = require('passport');
var config = require('../config');
var User = require('./user.js');

var AuthStrategy;

if (config.env === 'production') {

  // github authentication only works in production

  AuthStrategy = require('passport-github2').Strategy;
  passport.use(new AuthStrategy({
      clientID: config.secrets.GITHUB_CLIENT_ID,
      clientSecret: config.secrets.GITHUB_CLIENT_SECRET,
      callbackURL: config.authCallbackUrl,
      profile: true
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOneAndUpdate({
        githubId: profile.id
      }, {
        rawProfile: profile,
        username: profile.username,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        lastLogin: Date.now()
      }, {
        upsert: true,
        new: true
      }, function(err, response) {
        console.log(response);
        done(err, response);
      });
    }

  ));
} else {

  // local passwords for development
  // VERY INSECURE in practicr

  AuthStrategy = require('passport-local').Strategy;
  passport.use(new AuthStrategy(
    function(username, password, done) {
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));
};

passport.serializeUser(function(user, done) {
  console.log('serializing user: %j', user);
  console.log('result is %j', user.githubId);
  done(null, user.githubId);
});

passport.deserializeUser(function(id, done) {
  User.find({
    githubId: id
  }, function(error, user) {
    console.log('deserializing user: %j', id);
    console.log('result is %j', user);
    done(error, user);
  });
});

module.exports = passport;
