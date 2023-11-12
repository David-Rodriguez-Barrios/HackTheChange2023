import logo from './logo.svg';
import './App.css';
import light from './light 1.png';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
function App() {
  const responseMessage = (response) => {
    console.log(response);
};
const errorMessage = (error) => {
    console.log(error);
};


  return (
    <div className="App">
      <header className="App-header">
        <img src={light} className="App-logo" alt="logo" />
        <p className="Main">Power Together</p>
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
      </header>


    </div>
  );
}

export default App;
