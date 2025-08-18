import { useState, useEffect, ReactNode, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import NiceNavLink from "./NiceNavLink";
import NotificationsPopup from "./NotificationsPopup";
import 'bootstrap/js/dist/collapse';

const NavbarOverlay = ({ userinfo, children } : {children: ReactNode; userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null} | null}) => {
  return (
    <div className="navbar-overlay">
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-xxl">
          <Link className="navbar-brand" to="/">Kategoryzacja</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NiceNavLink to="/">Strona główna</NiceNavLink>
              </li>
              {userinfo && userinfo.role === "USER" &&
              <li className="nav-item">
                <NiceNavLink to="/kategoryzacja">E-Kategoryzacja</NiceNavLink>
              </li>}
              <li className="nav-item">
                <NiceNavLink to="/ranking">E-Ranking</NiceNavLink>
              </li>
              <li className="nav-item">
                <NiceNavLink to="/zasady">Zasady</NiceNavLink>
              </li>

              {userinfo && userinfo.role !== "USER" &&
              <li className="nav-item">
                <NiceNavLink to="/admin">Panel Administratora</NiceNavLink>
              </li>}
            </ul>
            {userinfo && <NotificationsPopup userinfo={userinfo} />}
            {
              userinfo === null ?
              <Link className="btn btn-outline-light me-2" to="/login">Zaloguj się</Link>
              :
              <Link className="btn btn-outline-light me-2" to="/logout">Wyloguj się</Link>
            }
          </div>
        </div>
      </nav>

      <div className="content container-xxl">
        {children}
      </div>
    </div>
  );
};

export default NavbarOverlay;
