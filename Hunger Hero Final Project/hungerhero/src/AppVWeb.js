// import logo from './logo.svg';
import './App.css';
import { React, useState, useRef } from 'react';

function App() {
  const start = useRef(false);
  const register = useRef(false);
  const registerComplete = useRef(false);
  const [, setStarted] = useState(false);
  const username = useRef('');
  const password = useRef('');
  const passwordConfirm = useRef('');
  const isUsernameAlphaNum = useRef(true);
  const isPasswordAlphaNum = useRef(true);
  const donorCollector = useRef('');
  const address = useRef('');

  function handleOnChangeUsername(e) {
    username.current = e.target.value;
    console.log('Username: ');
    console.log(username.current);
  }

  function handleOnChangePassword(e) {
    password.current = e.target.value;
    console.log('Password');
    console.log(password.current);
  }

  function handleOnChangePasswordConfirm(e) {
    passwordConfirm.current = e.target.value;
  }

  function handleOnAddressChange(e) {
    address.current = e.target.value;
  }

  function handleLogin() {
    if (username.current !== '') {
      for (let i = 0; i < username.current.length; i += 1) {
        const character = username.current.charAt(i);
        const num = character.charCodeAt(0);
        if (!(num >= 48 && num <= 57) && !(num >= 65 && num <= 90) && !(num >= 97 && num <= 122)) {
          isUsernameAlphaNum.current = false;
        }
      }
    }

    if (password.current !== '') {
      for (let i = 0; i < password.current.length; i += 1) {
        const character = password.current.charAt(i);
        const num = character.charCodeAt(0);
        if (!(num >= 48 && num <= 57) && !(num >= 65 && num <= 90) && !(num >= 97 && num <= 122)) {
          isPasswordAlphaNum.current = false;
        }
      }
    }

    setStarted(true);
    start.current = true;
  }

  function handleRegister() {
    console.log('Register Button Pressed');
    register.current = true;
    start.current = true;
    setStarted(true);
  }

  function handleOnChangeSelect(e) {
    e.preventDefault();
    donorCollector.current = e.value;
  }

  function handleRegisterComplete() {
    console.log('Register Complete Button Pressed');
    start.current = true;
    setStarted(true);
    registerComplete.current = true;
  }

  if (!start.current) {
    return (
      <div>
        <p>Hunger Hero</p>
        <p>Please Enter Your Username and Passowrd</p>
        <div>
          <input type="text" onChange={handleOnChangeUsername} />
        </div>
        <div>
          <input type="text" onChange={handleOnChangePassword} />
        </div>
        <button type="submit" onClick={handleLogin}>Login</button>
        <div>
          <button type="submit" onClick={handleRegister}>New to Hunger Hero? Register a new account</button>
        </div>
      </div>
    );
  } if (!register.current) {
    return (
      <div>
        <p>Enter a Username</p>
        <div>
          <input type="text" onChange={handleOnChangeUsername} />
        </div>
        <p>Enter a Passowrd</p>
        <div>
          <input type="text" onChange={handleOnChangePassword} />
        </div>
        <p>Confirm your Password</p>
        <div>
          <input type="text" onChange={handleOnChangePasswordConfirm} />
        </div>
        <div>
          Would you like to register as a donor or collector
        </div>
        <label htmlFor="don">
          Donor
          <input
            type="radio"
            id="don"
            name="specify"
            onChange={handleOnChangeSelect}
            value="donor"
          />
        </label>
        Collector
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
      </div>
    );
  } if (registerComplete.current) {
    <div>
      Registration Complete
    </div>;
  } else {
    console.log('Register: ');
    console.log(register.current);
    return (
      <div>
        Login Authenticated
      </div>
    );
  }
}

export default App;
