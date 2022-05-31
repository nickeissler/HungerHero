// import logo from './logo.svg';
import './App.css';
import {
  React, useState, useRef, useEffect,
} from 'react';
import MainPage from './MainPage';
import MessageBox from './MessageBox';
import setupWSConnection from './wsnotif';

const apiModule = require('./api');

function App() {
  const start = useRef(true);
  const register = useRef(false);
  const registerComplete = useRef(false);
  const incompleteFields = useRef(false);

  const [, setRegistering] = useState(false);
  const [, setSignedIn] = useState(false);
  const [, setErrorUser] = useState(false);
  const [, setErrorPass] = useState(false);
  const [, setErrorPassmatch] = useState(false);
  const [, setErrorDC] = useState(false);
  const [, setErrorAddress] = useState(false);
  const [, setPasswordInc] = useState(false);
  const [, setPasswordNone] = useState(false);
  const [, setErrorForm] = useState(false);
  const [, setUserNone] = useState(false);
  const [, setUserMiss] = useState(false);
  const [, setUserLock] = useState(false);
  const [, setErrorDupUser] = useState(false);
  const [, setChangePassword] = useState(false);
  const [, setErrorChangePasswordUsername] = useState(false);
  const [, setErrorChangePasswordConfirm] = useState(false);
  const [, setErrorAccountDNE] = useState(false);
  const [, setPasswordChangeChangeAccept] = useState(false);
  const [, newMsg] = useState(0);
  const [, newNotif] = useState(0);
  const username = useRef('');
  const password = useRef('');
  const passwordConfirm = useRef('');
  const donorCollector = useRef('');
  const address = useRef('');
  const errorMessageReg = useRef('');
  const errorMessageLog = useRef('');
  const hasErrorReg = useRef(false);
  const hasErrorLog = useRef(false);
  const numAttempts = useRef(0);
  const changingPassword = useRef(false);
  const changePassword = useRef('');
  const changePasswordConfirm = useRef('');
  const changePasswordAccepted = useRef(false);
  const msgs = useRef([]);
  const notifs = useRef('');

  const mapRef = useRef(null);
  const [map, setMap] = useState();
  const currentUser = useRef({});

  const messageOpen = useRef(false);
  const [, setMessaging] = useState(false);

  const notifBox = useRef(false);
  const [, setNotif] = useState(false);

  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(new window.google.maps.Map(mapRef.current, {}));
    }
  }, [mapRef, map]);

  const updateMessages = () => {
    newMsg((count) => count + 1);
  };

  const updateNotifs = () => {
    newNotif((n) => n + 1);
    if (!messageOpen.current) {
      notifBox.current = !notifBox.current;
      setNotif(notifBox.current);
      setTimeout(() => {
        notifBox.current = !notifBox.current;
        setNotif(notifBox.current);
      }, 5000);
    }
  };

  function handleOnChangeUsername(e) {
    username.current = e.target.value;
  }

  function handleOnChangePassword(e) {
    password.current = e.target.value;
  }

  function handleOnChangePasswordConfirm(e) {
    passwordConfirm.current = e.target.value;
  }

  function handleOnAddressChange(e) {
    address.current = e.target.value;
  }

  function handleOnChangeSelect(e) {
    donorCollector.current = e.target.value;
  }

  function handleContinue() {
    registerComplete.current = false;
    setSignedIn(true);
  }

  function handleRegister() {
    register.current = true;
    start.current = false;
    setRegistering(true);
  }

  function handleChangePassword() {
    start.current = false;
    changingPassword.current = true;
    username.current = '';
    password.current = '';
    setChangePassword(true);
  }

  function handleCancelChangePassword() {
    start.current = true;
    changingPassword.current = false;
    changePassword.current = '';
    changePasswordConfirm.current = '';
    hasErrorLog.current = false;
    errorMessageLog.current = '';
    setErrorChangePasswordUsername(false);
    setErrorChangePasswordConfirm(false);
    setErrorAccountDNE(false);
    setChangePassword(false);
  }

  function handlePasswordOne(e) {
    changePassword.current = e.target.value;
  }

  function handlePasswordTwo(e) {
    changePasswordConfirm.current = e.target.value;
  }

  function handleAcceptNewPassword() {
    start.current = true;
    changePasswordAccepted.current = false;
    username.current = '';
    password.current = '';
    setPasswordChangeChangeAccept(false);
  }

  async function handleConfirmChangePassword() {
    hasErrorLog.current = false;
    errorMessageLog.current = '';
    setErrorChangePasswordUsername(false);
    setErrorChangePasswordConfirm(false);
    setErrorAccountDNE(false);
    if (!changePassword.current || !changePasswordConfirm.current
                            || !username.current || !password.current) {
      errorMessageLog.current = 'Field(s) left blank';
      hasErrorLog.current = true;
      setErrorChangePasswordUsername(true);
      return;
    }
    if (changePassword.current !== changePasswordConfirm.current) {
      errorMessageLog.current = 'Passwords do not match';
      hasErrorLog.current = true;
      setErrorChangePasswordConfirm(true);
      return;
    }
    try {
      const result = await apiModule.loginPlayer(username.current, password.current);
      if (password.current !== result.result.password || result === null) {
        errorMessageLog.current = 'Username/Password incorrect';
        hasErrorLog.current = true;
        setErrorAccountDNE(true);
        return;
      }
      console.log('Calling change pw');
      await apiModule.changePassword(username.current, changePassword.current);
      changingPassword.current = false;
      changePasswordAccepted.current = true;
      setChangePassword(false);
      setPasswordChangeChangeAccept(true);
    } catch (error) {
      errorMessageLog.current = 'Username/Password incorrect';
      hasErrorLog.current = true;
      setErrorAccountDNE(true);
      throw new Error('Error in confirm change password');
    }
  }

  async function handleLogIn() {
    setPasswordInc(false);
    setPasswordNone(false);
    setUserNone(false);
    setUserMiss(false);
    setUserLock(false);
    if (username.current.length === 0) {
      errorMessageLog.current = 'Please Enter Username';
      hasErrorLog.current = true;
      setUserNone(true);
      return;
    }
    if (password.current.length === 0) {
      errorMessageLog.current = 'Please Enter Password';
      hasErrorLog.current = true;
      setPasswordNone(true);
      return;
    }
    try {
      const result = await apiModule.loginPlayer(username.current, password.current);
      console.log(result);
      if (password.current !== result.result.password) {
        errorMessageLog.current = 'Incorrect Password';
        hasErrorLog.current = true;
        setPasswordInc(true);
        numAttempts.current += 1;
        console.log(numAttempts.current);
        if (numAttempts.current > 3 || result.result.lockout) {
          console.log('do we arrive here?');
          errorMessageLog.current = 'Too Many Failed Log-Ins: Try Again in 12 hours';
          // const updateLock = await apiModule.lockPlayer(username.current, true);
          setUserLock(true);
        }
        return;
      }
      if (!result.result.lockout) {
        currentUser.current = result.result;
        console.log('REsult');
        console.log(result);
        console.log('Current');
        console.log(currentUser.current);
        start.current = false;

        // Token generation
        if (sessionStorage.getItem('token') == null) {
          const token = await apiModule.generateToken(currentUser.current.username);
          sessionStorage.setItem('token', token);
          setupWSConnection(updateMessages, msgs, updateNotifs, notifs);
        } else {
          const token = sessionStorage.getItem('token');
          const code = await apiModule.verifyToken(token);

          if (code === 200) {
            console.log('Session', 'Valid');
            setupWSConnection(updateMessages, msgs, updateNotifs, notifs);
          } else if (code === 302) {
            console.log('Session', 'Expired');
            console.log('Regenerating Token');

            const newToken = await apiModule.generateToken(currentUser.current);
            sessionStorage.removeItem('token');
            sessionStorage.setItem('token', newToken);
            setupWSConnection(updateMessages, msgs, updateNotifs, notifs);
          }
        }

        setSignedIn(true);
      }
    } catch {
      errorMessageLog.current = 'Username not found';
      hasErrorLog.current = true;
      setUserMiss(true);
    }
  }

  async function handleRegisterComplete() {
    setErrorUser(false);
    setErrorPass(false);
    setErrorPassmatch(false);
    setErrorDC(false);
    setErrorAddress(false);
    setErrorDupUser(false);
    setErrorForm(false);
    if (!username.current || username.current.length === 0 || /[^0-9a-zA-Z]/.test(username.current)) {
      errorMessageReg.current = 'Please provide an alphanumeric username';
      hasErrorReg.current = true;
      setErrorUser(true);
      return;
    }
    if (!password.current || password.current.length === 0) {
      errorMessageReg.current = 'Please provide a password';
      hasErrorReg.current = true;
      setErrorPass(true);
      return;
    }
    if (password.current !== passwordConfirm.current) {
      errorMessageReg.current = 'Passwords do not match';
      hasErrorReg.current = true;
      setErrorPassmatch(true);
      return;
    }
    const paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (!password.current.match(paswd)) {
      errorMessageReg.current = 'Password should be between 7 and 15 characters, contain a number, and a special character';
      hasErrorReg.current = true;
      setErrorForm(true);
      return;
    }
    if (!donorCollector.current) {
      errorMessageReg.current = 'Please provide donor or collector status';
      hasErrorReg.current = true;
      setErrorDC(true);
      return;
    }
    if (!address.current || address.current.length === 0) {
      errorMessageReg.current = 'Please provide an address';
      hasErrorReg.current = true;
      setErrorAddress(true);
      return;
    }
    hasErrorReg.current = false;
    errorMessageReg.current = '';
    if (!hasErrorReg.current) {
      const friends = [];
      const addResult = await apiModule.addPlayer(
        username.current,
        password.current,
        address.current,
        donorCollector.current,
        friends,
      );
      if (addResult === null) {
        console.log('Duplicate name');
        hasErrorReg.current = true;
        errorMessageReg.current = 'Sorry, this username is taken';
        setErrorDupUser(true);
        return;
      }
      registerComplete.current = true;
      register.current = false;
      start.current = false;
      incompleteFields.current = false;
      const result = await apiModule.loginPlayer(username.current, password.current);
      currentUser.current = result.result;
      setRegistering(false);
    }
  }

  function openMessages() {
    messageOpen.current = !messageOpen.current;
    setMessaging(messageOpen.current);
  }

  /**
  let matchError = null;
  let incError = null;
  if (!(password.current === passwordConfirm.current)) {
    matchError = 'Passwords do not match';
  } else {
    matchError = '';
  }

  if (!(username.current && password.current && donorCollector.current && address.current)) {
    incError = 'Some fields were left incomplete';
  } else {
    incError = '';
  }
  */
  if (start.current) {
    return (
      <div className="maindiv">
        <h1>Hunger Hero</h1>
        <div className="mainform">
          <p>Please Enter Your Username and Passowrd</p>
          <div>
            <input type="text" onChange={handleOnChangeUsername} />
          </div>
          <div>
            <input type="password" onChange={handleOnChangePassword} />
          </div>
          <button type="submit" onClick={handleLogIn}>Login</button>
          <div>
            <button type="submit" onClick={handleRegister}>New to Hunger Hero? Register a new account</button>
          </div>
          <div>
            <button type="submit" onClick={handleChangePassword}>Change Password</button>
          </div>
          { hasErrorLog.current && (
          <p className="error">
            {' '}
            {errorMessageLog.current}
            {' '}
          </p>
          )}
        </div>
      </div>
    );
  } if (register.current) {
    return (
      <div className="maindiv">
        <h1>Hunger Hero</h1>
        <div className="mainform">
          <p>Enter a Username</p>
          <div>
            <input type="text" onChange={handleOnChangeUsername} />
          </div>
          <p>Enter a Password</p>
          <div>
            <input type="password" onChange={handleOnChangePassword} />
          </div>
          <p>Confirm your Password</p>
          <div>
            <input type="password" onChange={handleOnChangePasswordConfirm} />
            {/* <div class="donotmatch">{matchError}</div> */}
          </div>
          <div>
            Would you like to register as a donor or collector
          </div>
          <input
            type="radio"
            id="don"
            name="specify"
            onChange={handleOnChangeSelect}
            value="donor"
          />
          <input
            type="radio"
            id="col"
            name="specify"
            onChange={handleOnChangeSelect}
            value="collector"
          />
          <div>
            Enter your address
          </div>
          <div>
            <input type="text" onChange={handleOnAddressChange} />
          </div>
          <div>
            <button type="submit" onClick={handleRegisterComplete}>Complete Registration</button>
          </div>
          { hasErrorReg.current
          && (
            <p className="error">
              {errorMessageReg.current}
            </p>
          )}
        </div>
      </div>
    );
  } if (registerComplete.current) {
    return (
      <div className="maindiv">
        <h1>Hunger Hero</h1>
        <h6>
          UserName:
          {username.current}
        </h6>
        <h6>
          You are a:
          {donorCollector.current}
        </h6>
        <h6>
          You are located at:
          {address.current}
        </h6>
        <button type="submit" onClick={handleContinue}>Continue</button>
      </div>
    );
  } if (changingPassword.current) {
    return (
      <div className="maindiv">
        <h1>Hunger Hero</h1>
        <div className="mainform">
          <p>Username</p>
          <div>
            <input type="text" onChange={handleOnChangeUsername} />
          </div>
          <p>Password</p>
          <div>
            <input type="password" onChange={handleOnChangePassword} />
          </div>
          <p>New Password</p>
          <div>
            <input type="password" onChange={handlePasswordOne} />
          </div>
          <p>Confirm Password</p>
          <div>
            <input type="password" onChange={handlePasswordTwo} />
          </div>
          <div>
            <button type="submit" onClick={handleConfirmChangePassword}>Submit</button>
          </div>
          <div>
            <button type="submit" onClick={handleCancelChangePassword}>Cancel</button>
          </div>
          { hasErrorLog.current
          && (
            <p className="error">
              {errorMessageLog.current}
            </p>
          )}
        </div>
      </div>
    );
  } if (changePasswordAccepted.current) {
    return (
      <div className="maindiv">
        <h1>Hunger Hero</h1>
        <div className="mainform">
          <p>Your password has been successfully changed</p>
          <div>
            <button type="submit" onClick={handleAcceptNewPassword}>Continue</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="maindiv">
      <MainPage user={currentUser.current} />
      <button type="button" className="open-msg-btn" onClick={openMessages}>Messages</button>
      {messageOpen.current ? <button type="button" className="close-chat" onClick={openMessages}>X</button> : null}
      {messageOpen.current ? (
        <MessageBox
          user={currentUser.current}
          msgs={msgs.current}
          notifs={notifs.current}
        />
      ) : null}
      {notifBox.current ? notifs.current : null}
    </div>
  );
}
export default App;
