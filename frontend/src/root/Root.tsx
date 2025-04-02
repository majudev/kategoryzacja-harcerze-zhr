import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";

const API_ROOT = process.env.REACT_APP_API_URL;

const Root = ({userinfo} : {userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null; team: {}|null; teamAccepted: boolean;} | null}) => {
    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER"){
                if(userinfo.team === null || !userinfo.teamAccepted){
                    console.log("Redirecting to /welcome");
                    navigate("/welcome", {replace: true});
                }
            }
        }
    }, [userinfo]);

    return (
      <NavbarOverlay userinfo={userinfo}>
        test
      </NavbarOverlay>
    );
  };
  
  export default Root;
  