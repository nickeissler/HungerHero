import {
  React, useRef, useState,
} from 'react';
// import PropTypes from 'prop-types';
import FriendsPage from './FriendsPage';
// import Maps from './Maps';
import DonationsComponent from './DonationsComponent';
import UserPage from './UserPage';

const apiModule = require('./api');

function MainPage({ user }) {
  const [, setViewFriends] = useState(false);
  const viewFriends = useRef(false);
  const [, setViewDonations] = useState(false);
  const viewDonations = useRef(false);
  const [, setViewProfile] = useState(false);
  const viewProfile = useRef(false);
  const currUser = useRef(user);

  function handleViewFriends() {
    viewFriends.current = true;
    setViewFriends(true);
  }

  function handleViewDonations() {
    viewDonations.current = true;
    setViewDonations(true);
  }

  function handleViewProfile() {
    viewProfile.current = true;
    setViewProfile(true);
  }

  async function handleBackFromFriends() {
    viewFriends.current = false;
    const result = await apiModule.getUser(user.username);
    currUser.current = result.result;
    setViewFriends(false);
  }
  function handleBackFromDonations() {
    viewDonations.current = false;
    setViewDonations(false);
  }
  function handleBackViewProfile() {
    viewProfile.current = false;
    setViewProfile(false);
  }

  if (viewFriends.current) {
    return (
      <div>
        <div><FriendsPage user={user} /></div>
        <div>
          <button
            type="button"
            style={
          {
            maxWidth: '400px',
            maxHeight: '25px',
            minWidth: '400px',
            minHeight: '25px',
            marginBottom: '25px',
          }
        }
            onClick={handleBackFromFriends}
          >
            Return
          </button>
        </div>
      </div>
    );
  } if (viewDonations.current) {
    return (
      <div>
        <div><DonationsComponent user={user} /></div>
        <div>
          <button
            type="button"
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
            onClick={handleBackFromDonations}
          >
            Return
          </button>
        </div>
      </div>
    );
  } if (viewProfile.current) {
    return (
      <div>
        <div><UserPage user={user} /></div>
        <div>
          <button
            type="button"
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
            onClick={handleBackViewProfile}
          >
            Return
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="maindiv">
      <div>
        <h1>Hunger Hero</h1>
      </div>
      <div />
      <div>
        <h6>
          <button
            type="button"
            style={{
              maxWidth: '400px',
              maxHeight: '50px',
              minWidth: '400px',
              minHeight: '50px',

            }}
            onClick={handleViewFriends}
          >
            View Friends
          </button>
          {' '}
          {' '}
          {' '}
          {' '}
          {' '}
          <button
            type="button"
            style={
            {
              maxWidth: '400px',
              maxHeight: '50px',
              minWidth: '400px',
              minHeight: '50px',

            }
          }
            onClick={handleViewDonations}
          >
            View And Log Donations
          </button>
          {' '}
          {' '}
          {' '}
          {' '}
          {' '}
          <button
            type="button"
            style={
            {
              maxWidth: '400px',
              maxHeight: '50px',
              minWidth: '400px',
              minHeight: '50px',

            }
          }
            onClick={handleViewProfile}
          >
            View Profile
          </button>
        </h6>
      </div>
      <h6>
        <br />
      </h6>
      <h6>
        <br />
      </h6>
      <div className="header">
        <p> Welcome to Hunger Hero! See Local Philadelphia Food Shelters and Information Below</p>
      </div>
      <div className="subhead">
        Philabundance
        <div className="content">
          Address: 3616 S Galloway St
          {' '}
          <br />
          Contact: (215)-339-0900
          {' '}
          <br />
          <a href="https://www.philabundance.org/?gclid=EAIaIQobChMI0YS65sLO9wIVBorICh26GwWvEAAYASAAEgJ1QPD_BwE">Philabundance.org</a>
        </div>
      </div>
      <div className="subhead">
        People&apos s Emergency Center Food Pantry
        <div className="content">
          Address: 325 N 39th St
          {' '}
          <br />
          Contact: (267)-777-5880
          {' '}
          <br />
          <a href="https://www.pec-cares.org">pec-cares.org</a>
        </div>
      </div>
      <div className="subhead">
        Cathedral Table Minsitries Food Pantry
        <div className="content">
          Address: 3723 Chestnut St
          {' '}
          <br />
          Contact: (215)-386-0234
          {' '}
          <br />
          <a href="http://www.philadelphiacathedral.org/service/article449310.htm">philadelphiacathedral.org</a>
        </div>
      </div>
      <div className="subhead">
        United Communities Southeast Philadelphia Food Pantry
        <div className="content">
          Address: 2029 S 8th St
          {' '}
          <br />
          Contact: (215)-468-6111
          {' '}
          <br />
          <a href="http://ucsep.org">ucsep.org</a>
        </div>
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

export default MainPage;
