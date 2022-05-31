import { React } from 'react';
import PropTypes from 'prop-types';

function NotifBox({ text }) {
  return (
    <div className="notification">
      <h5>New Message</h5>
      <p>{ text }</p>
    </div>
  );
}

NotifBox.propTypes = {
  text: PropTypes.string.isRequired,
};

export default NotifBox;
