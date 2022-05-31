// import supertest
const request = require('supertest');

const { ObjectId } = require('mongodb');
const webapp = require('./server');

// Import database operations
const dbLib = require('./dbOperations');
// MongoDB URL
const url = 'mongodb+srv://jameskea:Gallagher4@cluster0.ulbfr.mongodb.net/HW5?retryWrites=true&w=majority';
beforeAll(async () => {
  await dbLib.connect(url);
});

describe('/createUser and /deleteUser endpoint tests', () => {
  test('status codes 201 and 200 and responses for create and delete user', async () => {
    let currId;
    await request(webapp).post('/createUser').send({
      username: 'Test1',
      password: 'Yessir',
      address: '100 Street',
      type: 'Collector',
      friends: [],
    }).expect(201)
      .then((response) => {
        currId = new ObjectId(JSON.parse(response.text).message.slice(
          JSON.parse(response.text).message.indexOf('"') + 1,
          JSON.parse(response.text).message.lastIndexOf('"'),
        ));
        expect(JSON.parse(response.text).message).toContain('Player with id');
      });

    await request(webapp).delete('/deleteUser').send({
      playerId: currId,
    }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Player with id "${currId}" deleted`));
  });
});
describe('/addFriend endpoint tests', () => {
  test('add Friend check', async () => {
    let currId1;
    let currId2;
    let user1;
    let user2;
    await request(webapp).post('/createUser').send({
      username: 'TestAddFriend1',
      password: 'Yessir',
      address: '100 Street',
      type: 'Collector',
      friends: [],
    }).expect(201)
      .then((response) => {
        currId1 = new ObjectId(JSON.parse(response.text).message.slice(
          JSON.parse(response.text).message.indexOf('"') + 1,
          JSON.parse(response.text).message.lastIndexOf('"'),
        ));
        expect(JSON.parse(response.text).message).toContain('Player with id');
      });

    await request(webapp).post('/createUser').send({
      username: 'TestAddFriend2',
      password: 'Yessir',
      address: '100 Street',
      type: 'Collector',
      friends: [],
    }).expect(201)
      .then((response) => {
        currId2 = new ObjectId(JSON.parse(response.text).message.slice(
          JSON.parse(response.text).message.indexOf('"') + 1,
          JSON.parse(response.text).message.lastIndexOf('"'),
        ));
        expect(JSON.parse(response.text).message).toContain('Player with id');
      });

    await request(webapp).get('/user').query({
      username: 'TestAddFriend1',
    }).expect(200)
      .then((response) => {
        user1 = JSON.parse(response.text).result;
        expect(JSON.parse(response.text).result).toMatchObject(
          {
            _id: currId1,
            username: 'TestAddFriend1',
            password: 'Yessir',
            address: '100 Street',
            type: 'Collector',
            friends: [],
          },
        );
      });

    await request(webapp).get('/user').query({
      username: 'TestAddFriend2',
    }).expect(200)
      .then((response) => {
        user2 = JSON.parse(response.text).result;
        expect(JSON.parse(response.text).result).toMatchObject(
          {
            _id: currId2,
            username: 'TestAddFriend2',
            password: 'Yessir',
            address: '100 Street',
            type: 'Collector',
            friends: [],
          },
        );
      });

    await request(webapp).put('/addFriend').send({
      user: user1,
      newFriend: user2,
    }).expect(200)
      .then((response) => {
        expect(JSON.parse(response.text).message).toContain(
          `"${user1.username}" added "${user2.username}" as a friend`,
        );
      });

    await request(webapp).delete('/deleteUser').send({
      playerId: currId1,
    }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Player with id "${currId1}" deleted`));

    await request(webapp).delete('/deleteUser').send({
      playerId: currId2,
    }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Player with id "${currId2}" deleted`));
  });
});
describe('/login, /updateUser, /User, and /Users endpoint tests', () => {
  test('status codes and responses for login, update, get user, and get users', async () => {
    // Create User
    let currId;
    await request(webapp).post('/createUser').send({
      username: 'Test2',
      password: 'Yessir',
      address: '100 Street',
      type: 'Collector',
      friends: [],
    }).expect(201)
      .then((response) => {
        currId = new ObjectId(JSON.parse(response.text).message.slice(
          JSON.parse(response.text).message.indexOf('"') + 1,
          JSON.parse(response.text).message.lastIndexOf('"'),
        ));
        expect(JSON.parse(response.text).message).toContain('Player with id');
      });

    // LoginUser
    await request(webapp).post('/loginUser')
      .send({
        username: 'Test2',
        password: 'Yessir',
      })
      .expect(201)
      .then((response) => expect(JSON.parse(response.text).result).toMatchObject(
        {
          _id: currId,
          username: 'Test2',
          password: 'Yessir',
          address: '100 Street',
          type: 'Collector',
          friends: [],
        },
      ));

    // UpdateUser
    await request(webapp).put('/updateUser')
      .send({
        playerId: currId,
        data: { username: 'Test2Updated' },
      }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Player with id "${currId}" updated`));

    // GetUser
    await request(webapp).get('/user').query({
      username: 'Test2Updated',
    }).expect(200)
      .then((response) => {
        expect(JSON.parse(response.text).result).toMatchObject(
          {
            _id: currId,
            username: 'Test2Updated',
            password: 'Yessir',
            address: '100 Street',
            type: 'Collector',
            friends: [],
          },
        );
      });

    // GetUsers
    await request(webapp).get('/users').expect(200)
      .then((response) => {
        const data = JSON.parse(response.text).result;
        const testData = data.filter((user) => user.username === 'Test2Updated');
        expect(testData).toMatchObject(
          [{
            _id: currId,
            username: 'Test2Updated',
            password: 'Yessir',
            address: '100 Street',
            type: 'Collector',
            friends: [],
          }],
        );
      });

    // DeleteUser
    await request(webapp).delete('/deleteUser').send({
      playerId: currId,
    }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Player with id "${currId}" deleted`));
  });
  test('/login endpoint status code and response 404', () => {
    request(webapp).post('/loginUser')
      .send({
        username: '',
        password: 'abc',
      }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error).toBe('username not provided'));
  });
  test('/updateUser endpoint status code and response 404', () => {
    request(webapp).put('/updateUser')
      .send({
        data: {},
      }).expect(404)
      .then((response) => expect(JSON.parse(response.text).error).toBe('username not provided'));
  });
});
describe('/addDonation, /deleteDonation, and getDonations endpoint tests', () => {
  test('status codes 201 and 200 and responses for create and delete user', async () => {
    // Add First Donation
    let currId1;
    await request(webapp).post('/addDonation').send({
      donor: 'Test2',
      collector: 'Tim',
      date: '3/22/2022',
      description: 'Various fruits and vegetables',
      value: '55',
    }).expect(201)
      .then((response) => {
        currId1 = new ObjectId(JSON.parse(response.text).message.slice(
          JSON.parse(response.text).message.indexOf('"') + 1,
          JSON.parse(response.text).message.lastIndexOf('"'),
        ));
        expect(JSON.parse(response.text).message).toContain('Donation with id');
      });

    // Add Second Donation
    let currId2;
    await request(webapp).post('/addDonation').send({
      donor: 'Test3',
      collector: 'Tim',
      date: '3/22/2022',
      description: 'Various fruits and vegetables',
      value: '55',
    }).expect(201)
      .then((response) => {
        currId2 = new ObjectId(JSON.parse(response.text).message.slice(
          JSON.parse(response.text).message.indexOf('"') + 1,
          JSON.parse(response.text).message.lastIndexOf('"'),
        ));
        expect(JSON.parse(response.text).message).toContain('Donation with id');
      });

    // Get donations
    await request(webapp).get('/getDonations').query({
      collector: 'Tim',
    }).expect(200)
      .then((response) => {
        let donations = JSON.parse(response.text).result;
        donations = donations.filter((donation) => donation.collector === 'Tim');
        expect(donations).toMatchObject([
          {
            donor: 'Test2',
            collector: 'Tim',
            date: '3/22/2022',
            description: 'Various fruits and vegetables',
            value: '55',
          },
          {
            donor: 'Test3',
            collector: 'Tim',
            date: '3/22/2022',
            description: 'Various fruits and vegetables',
            value: '55',
          },
        ]);
      });
    // Delete First Donation
    await request(webapp).delete('/deleteDonation').send({
      donationId: currId1,
    }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Donation with id "${currId1}" deleted`));

    // Delete Second Donation
    await request(webapp).delete('/deleteDonation').send({
      donationId: currId2,
    }).expect(200)
      .then((response) => expect(JSON.parse(response.text).message)
        .toContain(`Donation with id "${currId2}" deleted`));
  });
  test('/addDonation endpoint error status code and response 404 for no donor', () => {
    request(webapp).post('/addDonation').send({
      donor: '',
      collector: 'Tim',
      date: '3/22/2022',
      description: 'Various fruits and vegetables',
      value: '55',
    }).expect(404)
      .then((response) => {
        expect(JSON.parse(response.text).error).toContain('donor not provided');
      });
  });
  test('/deleteDonation endpoint error status code and response 500 for no id', () => {
    request(webapp).delete('/deleteDonation').send({
      donationId: '@',
    }).expect(500)
      .then((response) => expect(JSON.parse(response.text).error)
        .toContain('try again later'));
  });
});
