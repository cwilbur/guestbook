module.exports = function(passport) {
  var config = require('../../config');
  var User = require('../models/user.js');

  var LocalStrategy = require('passport-local').Strategy;

  var mockAuthStrategy = new LocalStrategy(function(username, password, authDone) {
    // our secret method here:
    // straight username logs us in successfully
    // username followed by slash is failed authentication

    var loginShouldFail = false;

    if (username.indexOf('/') !== -1) {
      var segments = username.split('/');
      username = segments[0];
      loginShouldFail = true;
    }

    User.find({
      username: username
    }, function(error, user) {
      if (error) {
        // there was an error
        console.log('error: ' + error);
        return authDone(error);
      } else if (!user) {
        // the user was not found, failed login
        console.log('user not in database');
        return authDone(error, false);
      } else if (loginShouldFail) {
        // the programmer told us this login should fail
        console.log('user found in db; failed slash login');
        return authDone(error, false);
      } else {
        // we have a logged-in user!
        user.lastLogin = Date.now();
        user.save(function(error) {
          authDone(error, user);
        });
      }
    });
  });

  mockAuthStrategy.name = 'mock';
  passport.use(mockAuthStrategy);
};
