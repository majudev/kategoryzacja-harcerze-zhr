import React, { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './login/Login';
import Register from './login/Register';
import Activate from './login/Activate';
import './App.css';
import WelcomeOverlay from './welcome/WelcomeOverlay';

function App(): ReactElement {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:activationkey" element={<Activate />} />

          <Route path="/welcome" element={<WelcomeOverlay />} />

          <Route path="/kategoryzacja">

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
