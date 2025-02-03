import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const WelcomeStepUserAck = () => {
  return (
    <>
      <h3 className="text-center mb-3">Oczekiwanie na akcję administratora</h3>
      <p>
        Twoja prośba została wysłana. Może ją zaakceptować koordynator w Twojej chorągwi, lub dowolna osoba która już ma dostęp do jednostki (w przypadku istniejących jednostek).
      </p>
      <p>
        Możesz zamknąć to okno. Gdy dostaniesz uprawnienia, zostaniesz o tym powiadomiony mailowo - nie powinieneś już więcej zobaczyć tej strony.
      </p>
    </>
  );
};

export default WelcomeStepUserAck;
