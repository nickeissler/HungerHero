import {
  React, useRef, useState,
} from 'react';
// import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';

const apiModule = require('./api');

function MessageBox({ user, msgs }) {
  const rows = [];
  const txtMsg = useRef('');
  const msgRef = useRef(null);
  const curFriend = useRef('Pick a Friend');
  const [, newMsg] = useState(0);
  const [, newFriend] = useState('');

  const sendMsg = async (e) => {
    e.preventDefault();
    msgRef.current.value = '';
    newMsg(txtMsg.current);
    apiModule.sendMessage(user.username, curFriend.current, txtMsg.current);
  };

  function setText(e) {
    txtMsg.current = e.target.value;
  }

  async function setFriend(e) {
    curFriend.current = e.value;
    newFriend(curFriend.current);
  }

  for (let i = 0; i < 10; i += 1) {
    rows.push(
      { value: user.friends[i], label: user.friends[i] },
    );
  }

  return (
    <div className="messagebox">
      <div>
        <Select
          defaultValue={curFriend.current}
          onChange={(e) => setFriend(e)}
          options={rows}
        />
      </div>
      <div className="message-form">
        <table>
          <tbody className="msgs">
            { msgs }
          </tbody>
        </table>
        <hr />
        <form className="msg-input">
          <input type="text" autoComplete="off" ref={msgRef} id="msg-input" onChange={(e) => setText(e)} />
          <button type="button" className="msg-send" onClick={(e) => sendMsg(e)}>Send</button>
        </form>
      </div>
    </div>
  );
}

MessageBox.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    friends: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  msgs: PropTypes.arrayOf(PropTypes.elementType).isRequired,
};

export default MessageBox;
