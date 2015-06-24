var mockUsers = [];

mockUsers.add = function(person) {
  person.provider = 'mock';
  person.auth = {
    loggedIn: false,
    lastLogin: 'never'
  };
  this.push(person);
};

mockUsers.add({
  id: '2',
  username: 'cbabbage',
  displayName: 'Charles Babbage',
  profileUrl: 'https://en.wikipedia.org/wiki/Charles_Babbage',
  emails: ['charles@analyticalengine.ac.uk']
});

mockUsers.add({
  id: '3',
  username: 'ada',
  displayName: 'Augusta Ada King, Countess Lovelace',
  profileUrl: 'https://en.wikipedia.org/wiki/Ada_Lovelace',
  emails: ['root@analyticalengine.ac.uk']
});

mockUsers.add({
  id: '5',
  username: 'bertr',
  displayName: 'Bertrand Russell',
  profileUrl: 'https://en.wikipedia.org/wiki/Bertrand_Russell',
  emails: ['bertrand@cam.ac.uk']
});

mockUsers.add({
  id: '7',
  username: 'lambda',
  displayName: 'Alonzo Church',
  profileUrl: 'https://en.wikipedia.org/wiki/Alonzo_Church',
  emails: ['church@oxon.ac.uk']
});

mockUsers.add({
  id: '11',
  username: 'lambda',
  displayName: 'Alan Turing',
  profileUrl: 'https://en.wikipedia.org/wiki/Alan_Turing',
  emails: ['alan.turing@princeton.edu']
});

mockUsers.add({
  id: '13',
  username: 'nanosecond',
  displayName: 'Grace Hopper',
  profileUrl: 'https://en.wikipedia.org/wiki/Grace_Hopper',
  emails: ['grace.m.hopper@navy.mil']
});

module.exports = mockUsers;
