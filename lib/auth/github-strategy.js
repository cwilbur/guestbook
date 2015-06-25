var config = require('../../config');
var User = require('../models/user.js');

module.exports = function(passport) {

  var GithubStrategy = require('passport-github2').Strategy;

  var githubAuthStrategy = new GithubStrategy({
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
  );

  passport.use(githubAuthStrategy);

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

};
