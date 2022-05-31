import axios from 'axios';

const rootURL = 'http://localhost:4000';

async function addPlayer(username, password, address, type, friends) {
  if (!username) {
    throw new Error('invalid player');
  }
  try {
    console.log(`${username}`);
    const response = await axios.post(`${rootURL}/createUser`, {
      username: `${username}`,
      password: `${password}`,
      address: `${address}`,
      type: `${type}`,
      friends,
    });
    return response.data;
  } catch {
    return null;
  }
}

function getTime() {
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return `${date} ${time}`;
}

async function getUsers() {
  const response = await axios.get(`${rootURL}/users`, {
  }).catch((err) => { throw new Error(err); });
  return response.data.result;
}

async function addFriend(user, newFriendUsername) {
  if (!user) {
    throw new Error('invalid player');
  }
  const responseOne = await axios.get(`${rootURL}/user`, {
    params: {
      username: `${newFriendUsername}`,
    },
  }).catch((err) => { throw new Error(err); });
  if (!responseOne || !responseOne.data.result) {
    return;
  }
  const newFriend = responseOne.data.result;
  await axios.put(`${rootURL}/addFriend`, {
    user,
    newFriend,
  }).catch((err) => new Error(err));
}

async function lockPlayer(username, status) {
  const response = await axios.put(`${rootURL}/lockUser`, {
    username: `${username}`,
    status: `${status}`,
  });
  return response.data;
}

async function getUser(username) {
  if (!username) {
    throw new Error('invalid username');
  }
  const response = await axios.get(`${rootURL}/user`, {
    params: {
      username: `${username}`,
    },
  });
  return response.data;
}

async function loginPlayer(username, password) {
  if (!username) {
    throw new Error('Username not provided');
  }
  if (!password) {
    throw new Error('Password not provided');
  }
  try {
    const response = await axios.post(`${rootURL}/loginUser`, {
      username: `${username}`,
      password: `${password}`,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

async function generateToken(username) {
  try {
    if (username.length > 0) {
      const response = await axios.post(`${rootURL}/generateToken`, `username=${username}`);
      return response.data.token;
    }
    return null;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function addDonation(donor, collector, date, description, value) {
  if (!donor || !collector || !date || !description || !value) {
    throw new Error('invalid donation');
  }
  const response = await axios.post(`${rootURL}/addDonation`, {
    donor: `${donor}`,
    collector: `${collector}`,
    date: `${date}`,
    description: `${description}`,
    value: `${value}`,
    createdAt: `${getTime()}`,
  }).catch((err) => { throw new Error(err); });
  return response.data;
}

async function getDonations() {
  const collector = 'collector';
  if (!collector) {
    throw new Error('invalid collector');
  }
  console.log(`API collector: ${collector}`);
  const response = await axios.get(`${rootURL}/getDonations`, {
    params: {
      collector: `${collector}`,
    },
  }).catch((err) => { throw new Error(err); });
  return response.data.result;
}

async function changePassword(username, password) {
  try {
    const response = await axios.put(`${rootURL}/changePassword`, {
      username: `${username}`,
      password: `${password}`,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error in CP API');
  }
}

async function joinChat(username) {
  try {
    if (username.length > 0) {
      const response = await axios.post(`${rootURL}/joinChat`, `username=${username}`);
      return response.data.token;
    }
    return null;
  } catch (e) {
    console.error(e);
    return e;
  }
}

async function verifyToken(token) {
  try {
    if (token.length > 0) {
      const response = await axios.post(`${rootURL}/verifyToken`, `token=${token}`);
      return response.status;
    }
    return null;
  } catch (err) {
    console.error(err);
    return 302;
  }
}

async function sendMessage(sender, reciever, text) {
  const data = `userA=${sender}&userB=${reciever}&text=${text}`;
  const res = await axios.post(`${rootURL}/messages`, data);
  return res.data.text;
}

export {
  addPlayer, loginPlayer, addDonation, getDonations, getUser, getUsers,
  addFriend, lockPlayer, changePassword, sendMessage, verifyToken, joinChat, generateToken,
};
