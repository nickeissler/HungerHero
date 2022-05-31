const WebSocket = require('ws');

const jwt = require('jsonwebtoken');

// web socket
const wss = new WebSocket.Server({ port: 8085, clientTracking: true });

// Map of connected clients (user - client id) pairs
const connectedUsers = new Map();

// connection event
wss.on('connection', (ws, req) => {
  let client = '';
  let token;

  // client authentication get the JWT (token)
  // the webserver
  if (req.headers.token !== '') {
    token = req.headers.token;
  }
  if (ws.protocol !== '') { // the user's token
    token = ws.protocol;
    console.log('protocol', ws.protocol);
  }

  // verify the user - retrieve the username from the token
  jwt.verify(token, 'this_is_a_secret_key', (err, decoded) => {
    if (err) {
      console.log(`Error: ${err}`);
      return;
    }
    client = decoded.name;
    console.log(`New connection from user ${client}`);
    if (client !== 'webserver') {
      // add client to map of clients
      // key is the user name, value is the ws address
      connectedUsers.set(String(client), ws);
    }
  });

  // message event: sent by the webserver
  ws.on('message', (message) => {
    console.log(`Received message ${message} from user ${client}`);
    console.log(connectedUsers.keys());
    if (client === 'webserver') {
      // convert the message to JSON
      const msg = JSON.parse(message);
      if (msg.type === 'message') { // a user sent a new message
        // check that the sender and receiver are in the map of users

        if (connectedUsers.has(msg.data.userA) && connectedUsers.has(msg.data.userB)) {
          // send message to receiver

          const newMessage = { type: 'new message', userA: msg.data.userA, text: msg.data.text };
          connectedUsers.get(msg.data.userB).send(JSON.stringify(newMessage));

          const update = { type: 'delivered', userB: msg.data.userB, text: msg.data.text };
          connectedUsers.get(msg.data.userA).send(JSON.stringify(update));
        }
      }
      if (msg.type === 'new user') { // a new user joined the chat
        // iterate over the map to notify all the connected users
        const newUser = { type: 'new user', user: msg.data };
        connectedUsers.forEach((v) => { v.send(JSON.stringify(newUser)); });
      }
      if (msg.type === 'new friend') {
        const newFriendMsg = { type: 'new friend', user: msg.user, friend: msg.friend };
        connectedUsers.get(msg.friend).send(JSON.stringify(newFriendMsg));
      }
    }
  });

  // welcome message to connected clients
  const greet = { type: 'welcome' };
  ws.send(JSON.stringify(greet));
});
