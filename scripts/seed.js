var async = require('async');
var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.mongo.dbUrl);

var User = require('../lib/user.js');
var Entry = require('../lib/entry.js');
var mockUsers = require('../lib/mockUsers.js');

var peopleIds = {};

var tasks = [];

tasks.push(function(done) {
  User.remove({}, done);
});

tasks.push(function(done) {
  Entry.remove({}, done);
});

mockUsers.forEach(function(mockUser) {
  tasks.push(function(done) {
    User.create({
      githubId: mockUser.id,
      username: mockUser.username,
      displayName: mockUser.displayName,
      profileUrl: mockUser.profileUrl,
      emails: mockUser.emails
    }, function(error, user) {
      console.log('user %s created', user.displayName);
      peopleIds[user.username] = user.githubId;
      done();
    });
  });
});

tasks.push(function(done) {
  User.create({
    githubId: 1832,
    username: 'cwilbur',
    displayName: 'Charlton Wilbur',
    profileUrl: 'https://www.github.com/cwilbur',
    emails: ['charlton.wilbur@generalassemb.ly']
  }, function(error, user) {
    console.log('user %s created', user.displayName);
    peopleIds[user.username] = user.githubId;
    done();
  });
});

// function(done) {
//   Entry.create({
//     user: peopleIds.cwilbur,
//     comment: 'Welcome to my guestbook.'
//   }, done);
// },
// function(done) {
//   Entry.create({
//     user: peopleIds.rintintin,
//     comment: 'Woof!  Arf arf arf.  [tailwag]'
//   }, done);
// }

async.series(tasks, function(error, result) {
  mongoose.disconnect();
});
