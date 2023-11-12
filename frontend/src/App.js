import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useRef, useEffect, Fragment, useState } from 'react'
import Home from './pages/Home';
import Listings from './pages/Listings';
import Login from './pages/Login'
import Register from './pages/Register'
import Map from './pages/Map'
import CreateListing from './pages/CreateOrder'

const App = () => {
  const [email, setEmail] = useState('Guest');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings email={email}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Map" element={<Map/>} />
        <Route path="/create" element={<CreateListing/>} />
      </Routes>
    </Router>
  );
};

export default App;
