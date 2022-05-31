import { React } from 'react';
import NotifBox from './NotifBox';
// websocket operations
export default function setupWSConnection(updateMessages, texts, updateNotifs, notifs) {
  // if not registered, do nothing
  if (sessionStorage.getItem('token') === null) {
    return;
  }

  // Create WebSocket connection - we send the token as protocols
  const socket = new WebSocket('ws://localhost:8085', sessionStorage.getItem('token'));

  // Connection opened
  socket.addEventListener('open', () => {
    socket.send('Hello Server!');
  });

  let msgCount = 0;
  // Listener for messages from the websocket server
  socket.addEventListener('message', (event) => {
    // parse message to json
    const pushMessage = JSON.parse(event.data);

    // message delivered
    if (pushMessage.type === 'delivered') {
      const k = `sent${msgCount}`;
      texts.current.unshift(<tr key={k} className="r-msg">{pushMessage.text}</tr>);
      // update previous message box via state and props
      console.log('Delivered');
      updateMessages(); // update messages to fire re-rendering
      msgCount += 1;
    }
    // new message received
    if (pushMessage.type === 'new message') {
      const k = `received${msgCount}`;
      texts.current.unshift(<tr key={k} className="l-msg">{pushMessage.text}</tr>);

      updateMessages(); // update messages to fire re-rendering

      /* eslint-disable no-param-reassign */
      notifs.current = <NotifBox text={pushMessage.txt} />;
      updateNotifs();
      msgCount += 1;
    }

    if (pushMessage.type === 'new friend') {
      notifs.current.push(`${pushMessage.user} Added you as a friend!`);
      updateNotifs();
    }
  });

  // Connection closed
  socket.addEventListener('close', () => {
    console.log('Connection closed bye bye! ');
  });
}
