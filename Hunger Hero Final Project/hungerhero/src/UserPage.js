import {
  React, useRef,
} from 'react';
import DonationsComponent from './DonationsComponent';

function UserPage({ user }) {
  // const [, setShowStats] = useState(false);
  const showStats = useRef(false);

  /*
  function handleShowStats() {
    showStats.current = true;
    setShowStats(true);
  }
  */

  if (showStats.current) {
    return (
      <div>
        <DonationsComponent user={user} />
      </div>
    );
  }

  let friendList;
  if (user.friends == null) {
    friendList = [];
  } else {
    friendList = user.friends.join(', ');
  }

  return (
    <div className="maindiv">
      <div className="maindiv"><h1>Hunger Hero</h1></div>
      <div className="header">
        <p>{user.username}</p>
      </div>
      <div>
        <h6>
          Account Type:
          {user.type}
        </h6>
        <h6>
          Account Address:
          {user.address}
        </h6>
        <h6>
          {user.username}
          &apos s Friends List -
          {' '}
          { friendList }
        </h6>
      </div>
    </div>
  );
}

export default UserPage;
