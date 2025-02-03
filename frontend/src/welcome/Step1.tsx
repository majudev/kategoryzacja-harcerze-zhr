import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const WelcomeStep1 = ({setStep} : {setStep: React.Dispatch<React.SetStateAction<any>>}) => {
  return (
    <>
      <h3 className="text-center mb-3">Dokończ konfigurację konta</h3>
      <p>
        Twoje konto zostało założone i jest z nim wszystko ok!
      </p>
      <p>
        Musisz podać nam jeszcze kilka szczegółów zanim będziesz mógł zacząć korzystać z systemu do kategoryzacji.
      </p>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary m-1" onClick={() => setStep("2")}>Jestem drużynowym</button>
        <button className="btn btn-primary m-1" onClick={() => setStep("adminack")}>Jestem administratorem systemu</button>
      </div>
    </>
  );
};

export default WelcomeStep1;
