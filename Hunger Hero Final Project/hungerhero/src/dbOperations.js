/* eslint no-underscore-dangle: 0 */
const { MongoClient, ObjectId } = require('mongodb');

const connect = async (url) => {
  try {
    const conn = (await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )).db();
    return conn;
  } catch (err) {
    throw new Error('could not connect to the db');
  }
};

const addUser = async (db, newPlayer) => {
  const test = await db.collection('Users').findOne({ username: newPlayer.username });
  if (test !== null) {
    return null;
  }
  try {
    const result = await db.collection('Users').insertOne(newPlayer);
    return result;
  } catch (err) {
    throw new Error('could not add a player');
  }
};

const addLocation = async (db, newLocation) => {
  try {
    const result = await db.collection('Locations').insertOne(newLocation);
    return result;
  } catch (err) {
    throw new Error('could not add a new location');
  }
};

const getUsers = async (db) => {
  try {
    const result = await db.collection('Users').find({}).toArray();
    return result;
  } catch (err) {
    throw new Error('could not add a new location');
  }
};

const deleteLocation = async (db, locationId) => {
  try {
    const result = await db.collection('Locations').deleteOne({ _id: locationId });
    return result;
  } catch (err) {
    throw new Error('could not delete location');
  }
};

const getPlayer = async (db, player) => {
  const result = await db.collection('Users').findOne({ username: player });
  return result;
};
/**
async function clearPlayers(db) {
  try {
    db.collection('Users').drop();
  } catch (err) {
    throw new Error('could clear');
  }
}
*/
const deletePlayer = async (db, playerId) => {
  let result;
  try {
    result = await db.collection('Users').deleteOne({ _id: playerId });
  } catch (err) {
    throw new Error('could not delete player');
  }
  return result;
};

const updatePlayer = async (db, playerId, data) => {
  console.log(playerId);
  console.log(data);
  try {
    const result = await db.collection('Users').updateOne(
      { _id: playerId },
      { $set: data },
      (err) => {
        if (err) {
          throw new Error('Error updating');
        }
      },
    );
    return result;
  } catch (err) {
    throw new Error('could not update player');
  }
};

const addFriend = async (db, player, newFriend) => {
  if (!player || !player.username || !player.friends || !player._id) {
    throw new Error('player does not exist');
  }
  if (!newFriend || !newFriend.username || !newFriend.friends || !newFriend._id) {
    throw new Error('player to add does not exist');
  }
  const newFriendsCurr = player.friends;
  const newFriendsFriend = newFriend.friends;
  if (!newFriendsCurr.includes(newFriend.username) && !newFriendsFriend.includes(player.username)) {
    newFriendsCurr.push(newFriend.username);
    newFriendsFriend.push(player.username);
    try {
      await updatePlayer(db, new ObjectId(newFriend._id), { friends: newFriendsFriend });
      await updatePlayer(db, new ObjectId(player._id), { friends: newFriendsCurr });
      return;
    } catch (err) {
      throw new Error('could not add a friend');
    }
  } else {
    throw new Error('friend already added');
  }
};

const addDonation = async (db, donation) => {
  try {
    const result = await db.collection('Donations').insertOne(donation);
    return result;
  } catch (err) {
    throw new Error('could not add new donation');
  }
};

const deleteDonation = async (db, donationId) => {
  try {
    const result = await db.collection('Donations').deleteOne({ _id: donationId });
    return result;
  } catch (err) {
    return new Error('could not delete player');
  }
};

const getDonations = async (db) => {
  let result;
  try {
    result = await db.collection('Donations').find().toArray();
  } catch (err) {
    throw new Error('could not find donations');
  }
  return result;
};

/*
const sendChat = async (db, userA, userB, txt) => {
  let result;
  try {
    result = await db.collection('Chats').updateOne();
  } catch (err) {
    console.error(err);
  }
}; */

const lockPlayer = async (db, username, status) => {
  try {
    const result = await db.collection('Users').updateOne({ username }, { $set: { lockout: status } });
    return result;
  } catch (err) {
    throw new Error('Could not update the player');
  }
};

async function changePassword(db, username, password) {
  try {
    await db.collection('Users').updateOne(
      { username },
      { $set: { password } },
    );
    console.log('Done in DB');
  } catch (error) {
    throw new Error('Error in change password db');
  }
}

module.exports = {
  connect,
  addUser,
  deletePlayer,
  updatePlayer,
  getPlayer,
  addLocation,
  deleteLocation,
  addFriend,
  getUsers,
  addDonation,
  deleteDonation,
  getDonations,
  lockPlayer,
  changePassword,
};
