const express = require('express');
const { ObjectId } = require('mongodb');

const webapp = express();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const lib = require('./dbOperations');

let db;
const url = 'mongodb+srv://team:team@hungerhero.yfqnl.mongodb.net/HungerHero?retryWrites=true&w=majority';

const wsURL = 'ws://localhost:8085/';

const serverToken = jwt.sign({
  name: 'webserver',
}, 'this_is_a_secret_key', { expiresIn: '1h' });

// websocket connection with jwt
const connection = new WebSocket(wsURL, {
  headers: { token: serverToken },
});

connection.onopen = () => {
  connection.send('["webserver"]');
};

connection.onerror = (error) => {
  console.error(error);
};

connection.onmessage = (e) => {
  console.log(e.data);
};

webapp.use(cors({
  credentials: true,
  origin: true,
}));
webapp.use(express.json());
webapp.use(
  express.urlencoded({
    extended: true,
  }),
);
webapp.get('/', (_req, res) => {
  res.json({ message: 'SERVER' });
});

const port = process.env.PORT || 4000;

webapp.post('/loginUser', async (req, resp) => {
  if (!req.body.username || req.body.username.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
    return;
  } if (!req.body.password || req.body.password.length === 0) {
    resp.status(404).json({ error: 'password not provided' });
    return;
  }
  try {
    db = await lib.connect(url);
    const result = await lib.getPlayer(db, req.body.username);
    if (result === null) {
      resp.status(404).json({ error: 'could not find player' });
      return;
    }

    resp.status(201).json({ result });
  } catch {
    resp.status(404).json({ error: 'could not find player' });
  }
});

webapp.post('/generateToken', (req, resp) => {
  if (!req.body.username) {
    resp.status(400).json({ error: 'Null username cannot generate token' });
  }
  const { username } = req.body;
  const userToken = jwt.sign({
    name: username,
  }, 'this_is_a_secret_key', { expiresIn: '1h' });

  const msg = { type: 'new token', user: username, token: userToken };
  connection.send(JSON.stringify(msg));

  resp.json({ token: userToken });
});

webapp.get('/user', async (req, resp) => {
  if (!req.query.username || req.query.username.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
    return;
  }
  try {
    db = await lib.connect(url);
    const result = await lib.getPlayer(db, req.query.username);
    resp.status(200).json({ result });
  } catch (err) {
    resp.status(404).json({ error: 'could not find player' });
  }
});

webapp.get('/users', async (_, resp) => {
  try {
    db = await lib.connect(url);
    const result = await lib.getUsers(db);
    resp.status(200).json({ result });
  } catch (err) {
    resp.status(404).json({ error: 'could not find players' });
  }
});

webapp.post('/createUser', async (req, resp) => {
  if (!req.body.username || req.body.username.length === 0) {
    resp.status(404).json({ error: 'username not provided' });
    return;
  } if (/[^0-9a-zA-Z]/.test(req.body.username)) {
    resp.status(404).json({ error: 'username not alphanumeric' });
    return;
  } if (!req.body.password || req.body.password.length === 0) {
    resp.status(404).json({ error: 'password not provided' });
    return;
  } if (!req.body.type || req.body.type.length === 0) {
    resp.status(404).json({ error: 'type not provided' });
    return;
  } if (!req.body.address || req.body.address.length === 0) {
    resp.status(404).json({ error: 'type not provided' });
    return;
  }
  try {
    db = await lib.connect(url);
    const result = await lib.addUser(db, {
      username: req.body.username,
      password: req.body.password,
      address: req.body.address,
      type: req.body.type,
      lockout: false,
      friends: req.body.friends,
      createdAt: req.body.createdAt,
    });
    if (result === null) {
      resp.status(409).json({ message: 'Username already exists' });
      return;
    }
    resp.status(201).json({ message: `Player with id ${JSON.stringify(result.insertedId)} added` });
  } catch (err) {
    console.log(err);
    if (err.message === 'username already exists') {
      resp.status(500).json({ error: 'username already exists' });
      return;
    }
    resp.status(500).json({ error: 'Could not create user' });
  }
});

webapp.put('/lockUser', async (req, resp) => {
  try {
    db = await lib.connect(url);
    await lib.lockPlayer(db, req.body.username, req.body.status);
    resp.status(200).json({ message: `Player with id "${req.body.username}" updated priveliges` });
  } catch {
    resp.status(500).json({ error: 'Could not update' });
  }
});

webapp.put('/addFriend', async (req, resp) => {
  if (!req.body.user) {
    resp.status(404).json({ error: 'user not provided' });
    return;
  }
  if (!req.body.newFriend) {
    resp.status(404).json({ error: 'new friend not provided' });
    return;
  }
  try {
    db = await lib.connect(url);
    await lib.addFriend(db, req.body.user, req.body.newFriendUsername);
    const msg = { type: 'new friend', user: req.body.user, friend: req.body.newFriendUsername };
    connection.send(JSON.stringify(msg));
    resp.status(200).json({ message: `"${req.body.user.username}" added "${req.body.newFriendUsername}" as a friend` });
  } catch (err) {
    console.log(err);
    if (err.message === 'friend already added') {
      resp.status(500).json({ error: 'friend already added' });
    }
    resp.status(500).json({ error: 'Try again later' });
  }
});

webapp.put('/updateUser', async (req, resp) => {
  if (!req.body.playerId) {
    resp.status(404).json({ error: 'username not provided' });
    return;
  } if (!req.body.data) {
    resp.status(404).json({ error: 'data not provided' });
    return;
  }
  try {
    db = await lib.connect(url);
    await lib.updatePlayer(db, new ObjectId(req.body.playerId), req.body.data);
    resp.status(200).json({ message: `Player with id "${req.body.playerId}" updated` });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

webapp.delete('/deleteUser', async (req, resp) => {
  try {
    db = await lib.connect(url);
    await lib.deletePlayer(db, new ObjectId(req.body.playerId));
    resp.status(200).json({ message: `Player with id "${req.body.playerId}" deleted` });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

webapp.post('/addDonation', async (req, resp) => {
  if (!req.body.donor || req.body.donor.length === 0) {
    resp.status(404).json({ error: 'donor not provided' });
    return;
  } if (!req.body.collector || req.body.collector.length === 0) {
    resp.status(404).json({ error: 'collector not provided' });
    return;
  } if (!req.body.date || req.body.date.length === 0) {
    resp.status(404).json({ error: 'date not provided' });
    return;
  } if (!req.body.description || req.body.description.length === 0) {
    resp.status(404).json({ error: 'description not provided' });
    return;
  } if (!req.body.value || req.body.value.length === 0) {
    resp.status(404).json({ error: 'value not provided' });
    return;
  }

  try {
    db = await lib.connect(url);
    const result = await lib.addDonation(db, {
      donor: req.body.donor,
      collector: req.body.collector,
      date: req.body.date,
      description: req.body.description,
      value: req.body.value,
      createdAt: req.body.createdAt,
    });
    resp.status(201).json({ message: `Donation with id ${JSON.stringify(result.insertedId)} added` });
  } catch (err) {
    resp.status(500).json({ error: err });
  }
});

webapp.delete('/deleteDonation', async (req, resp) => {
  try {
    db = await lib.connect(url);
    await lib.deleteDonation(db, new ObjectId(req.body.donationId));
    resp.status(200).json({ message: `Donation with id "${req.body.donationId}" deleted` });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

webapp.get('/getDonations', async (_, resp) => {
  try {
    db = await lib.connect(url);
    const result = await lib.getDonations(db);
    resp.status(200).json({ result });
  } catch (err) {
    resp.status(500).json({ error: 'try again later' });
  }
});

// Messaging Endpoints
webapp.post('/joinChat', (req, resp) => {
  if (!req.body.username) {
    resp.status(400).json({ error: 'user session (name) invalid' });
  }
  const { username } = req.body;
  const userToken = jwt.sign({
    name: username,

  }, 'this_is_a_secret_key', { expiresIn: '1h' });

  const msg = { type: 'join chat', data: username };
  connection.send(JSON.stringify(msg));
  resp.json({ token: userToken });
});

webapp.post('/verifyToken', (req, resp) => {
  // check that the token was sent
  if (!req.body.token || req.body.token.length === 0) {
    resp.status(400).json({ error: 'missing token' });
    return;
  }
  // get the token
  const userToken = req.body.token;

  // verify the user token
  jwt.verify(userToken, 'this_is_a_secret_key', (err) => {
    if (err) {
      // check if the error is an expiration error
      if (err.name === 'TokenExpiredError') {
        resp.status(302).json({ error: 'session expired' });
        return;
      }
    }
    resp.json({ message: 'session valid' });
  });
});

webapp.post('/messages', async (req, resp) => {
  if (!req.body.userA || !req.body.userB || !req.body.userA) {
    resp.status(400).json({ error: 'Message Send missing field(s)' });
    return;
  }

  const msg = { type: 'message', data: { userA: req.body.userA, userB: req.body.userB, text: req.body.text } };
  connection.send(JSON.stringify(msg));
  resp.json({
    message: 'message received',
  });
});

webapp.put('/changePassword', async (req, resp) => {
  try {
    db = await lib.connect(url);
    await lib.changePassword(db, req.body.username, req.body.password);
    resp.status(200).json({ message: `Player ${req.body.playerId} updated password` });
  } catch (error) {
    resp.status(500).json({ error: 'try again later' });
  }
});

webapp.listen(port, async () => {
  try {
    db = await lib.connect(url);
  } catch (err) {
    throw new Error('cannot start server');
  }
});

module.exports = webapp;
