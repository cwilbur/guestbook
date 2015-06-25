var passport = require('passport');

require('./github-strategy.js')(passport);
require('./mock-strategy.js')(passport);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find({
    id: id
  }, function(error, user) {
    done(error, user);
  });
});

module.exports = passport;
