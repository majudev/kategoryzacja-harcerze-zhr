import React, { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "axios";
import Login from './login/Login';
import Register from './login/Register';
import Activate from './login/Activate';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import WelcomeOverlay from './welcome/WelcomeOverlay';
import Logout from './login/Logout';
import Root from './root/Root';
import Kategoryzacja from './kategoryzacja/Kategoryzacja';
import Ranking from './ranking/Ranking';

const API_ROOT = process.env.REACT_APP_API_URL;

export interface UserInfo {
  id: number;
  email: string;
  activated: boolean;
  createdAt: Date;
  lastLogin: Date;
  role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN";
  districtAdmin: {id: number; name: string;} | null;
  team: {
    id: number;
    name: string;
  }|null;
  teamAccepted: boolean;
};

function App(): ReactElement {
  // Use reloadHook(true) to force whole UI reload when login state has changed
  const [rldhook, reloadHook] = useState(false);

  const [userinfo, setUserinfo] = useState<UserInfo|null>(null);

  // Force login check on first entry on the page
  useEffect(() => {
    reloadHook(true);
  }, []);

  // Hook handler
  useEffect(() => {
    if(rldhook){
      loadUserinfo();
      reloadHook(false);
    }
  }, [rldhook]);

  const loadUserinfo = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/user/`);
      setUserinfo({...res.data, createdAt: new Date(res.data.createdAt), lastLogin: new Date(res.data.lastLogin)});
    } catch (err: any) {
      setUserinfo(null);
    }
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login reloadHook={reloadHook} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:activationkey" element={<Activate />} />
          <Route path="/logout" element={<Logout reloadHook={reloadHook} />} />
          <Route path="/welcome" element={<WelcomeOverlay reloadHook={reloadHook}/>} />

          <Route path="/" element={<Root userinfo={userinfo} />} />

          <Route path="/kategoryzacja" element={<Kategoryzacja userinfo={userinfo}/>} />

          <Route path="/ranking" element={<Ranking userinfo={userinfo}/>} />

          <Route path="/admin">
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
