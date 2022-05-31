/* eslint no-underscore-dangle: 0 */
const dbModule = require('./dbOperations');

let db;
const url = 'mongodb+srv://team:team@hungerhero.yfqnl.mongodb.net/HungerHero?retryWrites=true&w=majority';

const player1 = {
  username: 'Phillip',
  type: 'Donor',
  password: 'abc',
  address: '4500 spruce',
  friends: [],
};
const player2 = {
  username: 'JakeT',
  type: 'Collector',
  email: 'jake@email.com',
  password: 'abcd',
  address: '4500 spruce',
  friends: [],
};
const player3 = {
  username: 'Max',
  type: 'Donor',
  password: 'abcde',
  address: '4500 spruce',
  friends: [],
};
const player5 = {
  username: 'Will',
  type: 'Collector',
  password: 'abcde',
  address: '4500 spruce',
  friends: [],
};
const player6 = {
  username: 'Nick',
  type: 'Collector',
  password: 'abcde',
  address: '4500 spruce',
  friends: [],
};
const player7 = {
  username: 'test7',
  type: 'Collector',
  password: 'abcde',
  address: '4500 spruce',
  friends: [],
};
const player8 = {
  username: 'test8',
  type: 'Collector',
  password: 'abcde',
  address: '4500 spruce',
  friends: [],
};
const location1 = {
  name: 'Jimmy Johns',
  longitude: '40.0',
  latitude: '39.0',
  collector: 'John',
};
const donation1 = {
  donor: 'Test1',
  collector: 'Max',
  date: '3/22/2022',
  description: 'Various fruits and vegetables',
  value: '55',
};
const donation2 = {
  donor: 'Test2',
  collector: 'Max',
  date: '3/22/2022',
  description: 'Various fruits and vegetables',
  value: '55',
};
const donation3 = {
  donor: 'Test3',
  collector: 'Max',
  date: '3/22/2022',
  description: 'Various fruits and vegetables',
  value: '55',
};

/*
const donation4 = {
  donor: 'Jim',
  collector: 'Test4',
  date: '3/22/2022',
  description: 'Various fruits and vegetables',
  value: '55',
};
const donation5 = {
  donor: 'Jim',
  collector: 'Test5',
  date: '3/22/2022',
  description: 'Various fruits and vegetables',
  value: '55',
}; */

test('badConnect', async () => {
  try {
    db = await dbModule.connect('fgsadgs');
  } catch (err) {
    expect(err.message).toBe('could not connect to the db');
  }
});
test('addPlayer inserts a new player', async () => {
  db = await dbModule.connect(url);
  await dbModule.addUser(db, player1);
  const newPlayer = await db.collection('Users').findOne({ username: 'Phillip' });
  expect(newPlayer.username).toEqual('Phillip');
});
test('addLocation inserts a new location', async () => {
  db = await dbModule.connect(url);
  await dbModule.addLocation(db, location1);
  const newLocation = await db.collection('Locations').findOne({ name: 'Jimmy Johns' });
  await dbModule.deletePlayer(db, newLocation._id);
  expect(newLocation.name).toEqual('Jimmy Johns');
});
test('addPlayer throws an exception', async () => {
  db = await dbModule.connect(url);
  const playerB = 'testuser';
  try {
    await dbModule.addUser(db, playerB);
  } catch (err) {
    expect(err.message).toBe('could not add a player');
  }
});
test('getPlayer gets player', async () => {
  db = await dbModule.connect(url);
  const player = await dbModule.getPlayer(db, 'Phillip');
  await dbModule.deletePlayer(db, player._id);
  expect(player.username).toEqual('Phillip');
});
test('deletePlayer deletes the player', async () => {
  db = await dbModule.connect(url);
  await dbModule.addUser(db, player2);
  const newPlayer = await db.collection('Users').findOne({ username: 'JakeT' });
  await dbModule.deletePlayer(db, newPlayer._id);
  expect(newPlayer.username).toEqual('JakeT');
  try {
    await db.collection('Users').findOne({ _id: newPlayer.id });
  } catch (err) {
    expect(err);
  }
});
test('badDelete', async () => {
  db = await dbModule.connect(url);
  try {
    db = await dbModule.deletePlayer(db, 'sf');
  } catch (err) {
    expect(err.message).toBe('could not delete player');
  }
});
test('updatePlayer updates the player', async () => {
  db = await dbModule.connect(url);
  await dbModule.addUser(db, player3);
  let currPlayer = await db.collection('Users').findOne({ username: 'Max' });
  expect(currPlayer.username).toEqual('Max');
  await dbModule.updatePlayer(db, currPlayer._id, { type: 'Collector' });
  currPlayer = await db.collection('Users').findOne({ username: 'Max' });
  await dbModule.deletePlayer(db, currPlayer._id);
  expect(currPlayer.type).toEqual('Collector');
});
test('updatePlayer error 1', async () => {
  try {
    await dbModule.updatePlayer('', {});
  } catch (err) {
    expect(err.message).toBe('could not update player');
  }
});
test('addFriend inserts a new friend', async () => {
  db = await dbModule.connect(url);
  // Add first friend
  await dbModule.addUser(db, player5);
  const currPlayer1 = await db.collection('Users').findOne({ username: 'Will' });
  expect(currPlayer1.username).toEqual('Will');
  // Add second friend
  await dbModule.addUser(db, player6);
  const currPlayer2 = await db.collection('Users').findOne({ username: 'Nick' });
  expect(currPlayer2.username).toEqual('Nick');
  await dbModule.addFriend(db, currPlayer1, currPlayer2);
  expect(currPlayer1.friends).toEqual([currPlayer2.username]);
  expect(currPlayer2.friends).toEqual([currPlayer1.username]);
  await dbModule.deletePlayer(db, currPlayer1._id);
  await dbModule.deletePlayer(db, currPlayer2._id);
});
test('addFriend cant add the same friend', async () => {
  db = await dbModule.connect(url);
  // Add first friend
  await dbModule.addUser(db, player7);
  const currPlayer7 = await db.collection('Users').findOne({ username: 'test7' });
  expect(currPlayer7.username).toEqual('test7');
  // Add second friend
  await dbModule.addUser(db, player8);
  const currPlayer8 = await db.collection('Users').findOne({ username: 'test8' });
  expect(currPlayer8.username).toEqual('test8');
  await dbModule.addFriend(db, currPlayer7, currPlayer8);
  expect(currPlayer7.friends).toEqual([currPlayer8.username]);
  expect(currPlayer8.friends).toEqual([currPlayer7.username]);
  try {
    await dbModule.addFriend(db, currPlayer7, currPlayer8);
  } catch (err) {
    expect(err.message).toBe('friend already added');
  }
  await dbModule.deletePlayer(db, currPlayer7._id);
  await dbModule.deletePlayer(db, currPlayer8._id);
});
test('bad deleteDonations', async () => {
  db = await dbModule.connect(url);
  try {
    await dbModule.deleteDonation(db, '@');
  } catch (err) {
    expect(err.message).toBe('could not find donations');
  }
});
test('addDonations inserts a new donation and deletes it', async () => {
  db = await dbModule.connect(url);
  await dbModule.addDonation(db, donation1);
  const currDonation1 = await db.collection('Donations').findOne({ donor: 'Test1' });
  expect(currDonation1).toMatchObject({
    donor: 'Test1',
    collector: 'Max',
    date: '3/22/2022',
    description: 'Various fruits and vegetables',
    value: '55',
  });
  const delResp1 = await dbModule.deleteDonation(db, currDonation1._id);
  expect(delResp1.deletedCount).toEqual(1);
});
test('getDonations returns donations', async () => {
  db = await dbModule.connect(url);
  // add donations
  const currDonation2 = await dbModule.addDonation(db, donation2);
  const currDonation3 = await dbModule.addDonation(db, donation3);
  // declare id variables to delete later from DB
  const currId2 = currDonation2.insertedId;
  const currId3 = currDonation3.insertedId;
  // Get donations from collector
  let currDonations = await dbModule.getDonations(db);
  currDonations = currDonations.filter((donation) => donation.collector === 'Max');
  expect(currDonations).toMatchObject([
    {
      donor: 'Test2',
      collector: 'Max',
      date: '3/22/2022',
      description: 'Various fruits and vegetables',
      value: '55',
    },
    {
      donor: 'Test3',
      collector: 'Max',
      date: '3/22/2022',
      description: 'Various fruits and vegetables',
      value: '55',
    },
  ]);
  const delResp2 = await dbModule.deleteDonation(db, currId2);
  expect(delResp2.deletedCount).toEqual(1);
  const delResp3 = await dbModule.deleteDonation(db, currId3);
  expect(delResp3.deletedCount).toEqual(1);
});
