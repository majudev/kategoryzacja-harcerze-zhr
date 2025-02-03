import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import WelcomeStep1 from "./Step1";
import WelcomeStepAdminAck from "./StepAdminAck";
import WelcomeStep2 from "./Step2";
import WelcomeStepUserAck from "./StepUserAck";
import WelcomeStep3 from "./Step3";

const API_ROOT = process.env.REACT_APP_API_URL;

const WelcomeOverlay = () => {
  const navigate = useNavigate();

  const [userinfo, setUserinfo] = useState<{
    id: number;
    email: string;
    activated: boolean;
    createdAt: Date;
    lastLogin: Date;
    role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN";
    districtAdmin: {id: number; name: string;} | null;
    team: {accepted: boolean}|null;
  }>();
  const [error, setError] = useState("");
  const [step, setStep] = useState<"0"|"1"|"2"|"3"|"end"|"adminack"|"userack">("0");

  useEffect(() => {
    loadUserinfo();
  }, []);

  useEffect(() => {
    if(step === "end") navigate("/kategoryzacja");
  }, [step]);

  useEffect(() => {
    if(userinfo !== undefined){
      console.log(userinfo);
      if(userinfo && userinfo.team !== null){
        if(userinfo.team.accepted){
          setStep("end");
        }else setStep("userack");
      }else setStep("1");
    }
  }, [userinfo]);

  const loadUserinfo = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/user/`);
      setUserinfo({...res.data, createdAt: new Date(res.data.createdAt), lastLogin: new Date(res.data.lastLogin)});
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not fetch user data");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "550px" }}>
        {error && <div className="alert alert-danger">{translate(error)}</div>}
        {step === "0" && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Ładowanie...</span></div>}
        {step === "1" && <WelcomeStep1 setStep={setStep} />}
        {userinfo && step === "adminack" && <WelcomeStepAdminAck email={userinfo.email} setStep={setStep} />}
        {step === "2" && <WelcomeStep2 setStep={setStep} />}
        {userinfo && step === "3" && <WelcomeStep3 setStep={setStep} userId={userinfo.id} />}
        {step === "userack" && <WelcomeStepUserAck/>}
      </div>
    </div>
  );
};

export default WelcomeOverlay;
