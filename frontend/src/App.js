import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Login from './pages/Login'
import Register from './pages/Register'
import Map from './pages/Map'
import CreateListing from './pages/CreateOrder'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Map" element={<Map/>} />
        <Route path="/create" element={<CreateListing/>} />

      </Routes>
    </Router>
  );
};

export default App;
