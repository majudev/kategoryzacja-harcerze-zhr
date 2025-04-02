import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import DashboardLayout from "./dashboard";


const API_ROOT = process.env.REACT_APP_API_URL;

const Kategoryzacja3 = ({userinfo} : {userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null; team: {accepted: boolean}|null;} | null}) => {
    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER"){
                if(userinfo.team === null || !userinfo.team.accepted){
                    console.log("Redirecting to /welcome");
                    navigate("/welcome", {replace: true});
                }
            }else navigate("/", {replace: true}); // Kick admins outta here
        }
    }, [userinfo]);

    return (
      <NavbarOverlay userinfo={userinfo}>
        <DashboardLayout />
      </NavbarOverlay>
    );
  };
  
  export default Kategoryzacja3;
  