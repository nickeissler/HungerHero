import {
  React, useEffect, useState, useRef,
} from 'react';
// import PropTypes from 'prop-types';
import Select from 'react-select';
import UserPage from './UserPage';

const apiModule = require('./api');

function FriendPage({ user }) {
  const [, setUser] = useState(user);
  const currUser = useRef(user);
  const [, setUsers] = useState([]);
  const users = useRef([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [, setSeeFriend] = useState(false);
  const seeFriend = useRef(false);
  const currFriend = useRef({});

  async function handleSeeAllUsers() {
    const allUserProfiles = await apiModule.getUsers();
    const currUsers = [];
    console.log(currUser.current.friends);
    console.log(allUserProfiles);
    console.log(currUser.current.username);
    for (let i = 0; i < allUserProfiles.length; i += 1) {
      if (!currUser.current.friends.includes(
        allUserProfiles[i].username,
      ) && (allUserProfiles[i].username !== currUser.current.username)) {
        currUsers.push({
          value: allUserProfiles[i].username,
          label: allUserProfiles[i].username,
        });
      }
    }
    return currUsers;
  }

  async function handleSubmitAddFriend() {
    try {
      await apiModule.addFriend(currUser.current, selectedOption.value);
    } catch (err) {
      alert(err);
    }
    const result = await apiModule.getUser(currUser.current.username);
    currUser.current = result.result;
    users.current = await handleSeeAllUsers();
    setUser(result.result);
  }

  function handleSelect(username) {
    return async function f() {
      const result = await apiModule.getUser(username);
      currFriend.current = result.result;
      seeFriend.current = true;
      setSeeFriend(true);
    };
  }

  useEffect(async () => {
    const result = await apiModule.getUser(currUser.current.username);
    users.current = await handleSeeAllUsers();
    currUser.current = result.result;
    setUsers(users.current);
  }, []);

  if (seeFriend.current) {
    return (
      <div>
        <UserPage user={currFriend.current} />
      </div>
    );
  }

  console.log('currUser.friends user');
  console.log(currUser.current.friends);

  return (
    <div className="maindiv">
      <div className="maindiv"><h1>Hunger Hero</h1></div>
      <div className="mainform">
        <div className="header">
          <p>Enter a Friend To Add</p>
        </div>
        <div>
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            isSearchable
            options={users.current}
          />
        </div>
        <div>
          <br />
          <button
            type="submit"
            style={
            {
              maxWidth: '400px',
              maxHeight: '25px',
              minWidth: '400px',
              minHeight: '25px',
              marginBottom: '25px',
              align: 'center',
            }
          }
            onClick={handleSubmitAddFriend}
          >
            Add Friend
          </button>
        </div>
      </div>
      <div>
        <div className="header">
          <p>
            Current Friends -
            {currUser.current.friends.length}
          </p>
        </div>
        <ul>
          {currUser.current.friends.map((friendUsername) => (
            <li>
              <button
                type="button"
                style={
                {
                  maxWidth: '300px',
                  maxHeight: '25px',
                  minWidth: '300px',
                  minHeight: '25px',
                  marginBottom: '25px',
                  align: 'center',
                }
              }
                onClick={handleSelect(friendUsername)}
              >
                {friendUsername}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** MainPage.propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      friends: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }).isRequired,
  };* */

export default FriendPage;
