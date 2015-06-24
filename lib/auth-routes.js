var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var config = require('../config');
var Entry = require('./entry.js');
var User = require('./user.js');
var passport = require('./passport.js');

var authStrategy = config.authStrategy;

router.get('/github',
  passport.authenticate(authStrategy, {
    scope: ['user:email']
  }));

router.get('/github/callback',
  passport.authenticate(authStrategy, {
    failureRedirect: '/'
  }),
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
  });

router.post('/fakelogin', jsonParser);
router.post('/fakelogin',
  passport.authenticate('local', {
    failureRedirect: '/'
  }),
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
  });

router.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
