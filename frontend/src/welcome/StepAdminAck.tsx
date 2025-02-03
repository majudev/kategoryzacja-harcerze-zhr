import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const WelcomeStepAdminAck = ({email, setStep}: {email: string, setStep: React.Dispatch<React.SetStateAction<any>>}) => {
  return (
    <>
      <h3 className="text-center mb-3">Oczekiwanie na akcję administratora</h3>
      <p>
        Jeżeli jesteś "obsługą techniczną" systemu kategoryzacji, np. koordynatorem na poziomie chorągwi, członkiem ogólnopolskiego zespołu ds. kategoryzacji lub hufcowym, <b>zgłoś się do koordynatora krajowego</b> aby przyznał Ci uprawnienia w tym systemie. Podaj mu maila którym założyłeś konto: <b>{email}</b>. Pamiętaj że to nie stanie się automatycznie - musisz samodzielnie skontaktować się z właściwą osobą.
      </p>
      <p>
        Możesz zamknąć to okno. Gdy administrator nada ci uprawnienia, zostaniesz o tym powiadomiony - nie powinieneś już więcej zobaczyć tej strony.
      </p>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary m-1" onClick={() => setStep("2")}>Jednak jestem drużynowym</button>
      </div>
    </>
  );
};

export default WelcomeStepAdminAck;
