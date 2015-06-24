var config = require('./config');

// models

var mongoose = require('mongoose');
mongoose.connect(config.mongo.dbUrl);
var Entry = require('./lib/entry.js');
var User = require('./lib/user.js');

// basic express setup, views

var jade = require('jade');
var express = require('express');
var app = express();

app.set('view engine', 'jade');
app.set('views', './templates');

app.use(express.static(__dirname + '/public'));

// logging

var morgan = require('morgan');
app.use(morgan('dev'));

// sessions
// must be configured before authentication

var session = require('express-session');
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

var passport = require('./lib/passport.js');
app.use(passport.initialize());
app.use(passport.session());

var apiRouter = require('./lib/api-routes.js');
app.use('/api', apiRouter);

var authRouter = require('./lib/auth-routes.js');
app.use('/auth', authRouter);

app.get('/', function(req, res) {
  res.render('layout', {
    authStrategy: config.authStrategy,
    user: req.user,
  });
});

var server = app.listen(config.serverPort, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
