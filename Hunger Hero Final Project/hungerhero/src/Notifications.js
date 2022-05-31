import React, {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import './App.css';

function Notifications() {
  const [notify] = useState(false);
  // setNotify(true);
  return (
    <div>
      Notifications Component
      {notify
        && (
        <h6>
          Please enter all fields, ensure date is &quot / &quot separated, and value is an integer
        </h6>
        )}
    </div>
  );
}

Notifications.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
};

export default Notifications;
