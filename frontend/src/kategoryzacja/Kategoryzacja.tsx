import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import DashboardLayout from "./dashboard";

const API_ROOT = process.env.REACT_APP_API_URL;

const Kategoryzacja = ({userinfo} : {userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null; team: {}|null; teamAccepted: boolean;} | null}) => {
    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER"){
                if(userinfo.team === null || !userinfo.teamAccepted){
                    console.log("Redirecting to /welcome");
                    navigate("/welcome", {replace: true});
                }
            }else navigate("/", {replace: true}); // Kick admins outta here
        }
    }, [userinfo]);

    return (
      <NavbarOverlay userinfo={userinfo}>
        {/*<div className="col-lg-8 offset-lg-2 col-12 bg-danger">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled>Disabled</button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex={0}>Zaw1</div>
            <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex={0}>Zaw2</div>
            <div className="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabIndex={0}>Zaw3</div>
            <div className="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabIndex={0}>Zaw4</div>
          </div>
        </div>*/}
        <DashboardLayout />
      </NavbarOverlay>
    );
  };
  
  export default Kategoryzacja;
  