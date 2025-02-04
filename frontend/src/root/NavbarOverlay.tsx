import { useState, useEffect, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import NiceNavLink from "../NiceNavLink";

const NavbarOverlay = ({ userinfo, children } : {children: ReactNode; userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null} | null}) => {
  const navigate = useNavigate();

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
              {userinfo &&
              <li className="nav-item">
                <NiceNavLink to="/kategoryzacja">E-Kategoryzacja</NiceNavLink>
              </li>}
              <li className="nav-item">
                <NiceNavLink to="/kategoryzacja/ranking">E-Ranking</NiceNavLink>
              </li>
              <li className="nav-item">
                <NiceNavLink to="/kategoryzacja/zasady">Zasady</NiceNavLink>
              </li>

              {userinfo && userinfo.role === "DISTRICT_COORDINATOR" &&
              <li className="nav-item">
                <NiceNavLink to="/admin/district/my">Panel Chorągwi</NiceNavLink>
              </li>}

              {userinfo && userinfo.role === "TOPLEVEL_COORDINATOR" && 
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Panel Chorągwi
                </a>
                <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Chorągiew 1</a></li>
                <li><a className="dropdown-item" href="#">Chorągiew 2</a></li>
              </ul>
              </li>}
              {userinfo && userinfo.role === "TOPLEVEL_COORDINATOR" && 
              <li className="nav-item">
                <NiceNavLink to="/admin/full">Panel Ogólnopolski</NiceNavLink>
              </li>}
              {userinfo && userinfo.role === "ADMIN" &&
              <li className="nav-item">
                <NiceNavLink to="/admin/uber">Panel Administratora</NiceNavLink>
              </li>}
            </ul>
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
