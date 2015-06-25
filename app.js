var config = require('./config');

// models

var mongoose = require('mongoose');
console.log('CONNECTING TO MONGOOSE at ' + config.mongo.dbUrl);
mongoose.connect(config.mongo.dbUrl);
var Entry = require('./lib/models/entry.js');
var User = require('./lib/models/user.js');

// basic express setup, views

var jade = require('jade');
var express = require('express');
var app = express();

app.use(function(req, res, next) {
  // logging to catch an erroneous 'close' event for ajax calls
  req.on('close', function(err) {
    console.log('request connection closed early');
  });
  req.on('finish', function(err) {
    console.log('request connection finished');
  });
  next();
});

app.set('view engine', 'jade');
app.set('views', './templates');

app.use(express.static(__dirname + '/public'));

// logging

var morgan = require('morgan');
app.use(morgan('dev'));

// sessions
// must be configured before authentication

var session = require('express-session');
console.log('CONNECTING TO MONGO FOR SESSIONS AT: ' + config.mongo.dbUrl);
var MongoSessionDB = require('connect-mongodb-session')(session);
var mongoStore = new MongoSessionDB({
  uri: config.mongo.dbUrl,
  collection: 'webSessions'
});

if (config.env === 'production') {
  app.set('trust proxy', 1);
}

app.use(session({
  store: mongoStore,
  secret: config.secrets.SESSION_KEY,
  cookie: config.cookieOptions,
  resave: false,
  saveUninitialized: true
}));

// authentication

var passportAuth = require('./lib/auth');

app.use(passportAuth.initialize());
app.use(passportAuth.session());

var apiRouter = require('./lib/routes/api.js');
app.use('/api', apiRouter);

var authRouter = require('./lib/routes/auth.js');
app.use('/auth', authRouter);

app.get('/', function(req, res) {
  res.render('layout', {
    authStrategy: config.authStrategy,
    user: req.user,
  });
});

app.use(function(err, req, res, next) {
  console.log(err.message);
  console.error(err.stack);
  res.sendStatus(500);
});

var server = app.listen(config.serverPort, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
