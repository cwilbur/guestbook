var util = require('util');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var textParser = bodyParser.text();
var textBody = require('body');

var config = require('../../config');
var Entry = require('../models/entry.js');
var User = require('../models/user.js');
var passportAuth = require('../auth/');

var authStrategy = config.authStrategy;

router.get('/github',
  passportAuth.authenticate(authStrategy, {
    scope: ['user:email']
  }));

router.get('/github/callback',
  passportAuth.authenticate(authStrategy, {
    failureRedirect: '/'
  }),
  function(req, res) {
    console.log(req.user);
    // res.redirect('/');
  });

router.post('/fakelogin',
  function(req, res, next) {
    textBody(req, res, function(err, body) {
      console.log('original request body: ');
      console.log(body);
      next();
    });
  }
);

router.post('/fakelogin', jsonParser);
router.post('/fakelogin', function(req, res, next) {
  // after we parse
  console.log('parsed request body: ');
  console.log(util.inspect(req.body));
  next();
});
router.post('/fakelogin',
  passportAuth.authenticate('mock', {}),
  function(req, res) {
    console.log(req.user);
    res.sendStatus(200);
  });

router.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/');
  });

module.exports = router;
