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
        <div className={`container py-4 mt-5`}>
          <div className="row">
            <div className="col-12 col-lg-8 offset-lg-2 card shadow-lg" style={{backgroundColor: 'rgb(164, 200, 97)'}}>
              <div className="card-body">
                <h3 className="card-title mt-3">Druhowie!</h3>
                <p className="card-text">
                  Sprawdzenie zeszłorocznego arkusza kategoryzacyjnego da Wam świetny
                  ogląd co do tego gdzie byliście — być może dzięki temu będziecie w stanie
                  lepiej zdecydować, gdzie warto rozłożyć siły i akcenty w tym roku? Być może
                  jesteście w stanie zdobyć w tym roku wyższą kategorię i zawalczyć o tytuł
                  <em> Drużyny Sokolej</em>, <em>Orlej</em> bądź <em>Rzeczypospolitej</em>?
                </p>

                <p className="card-text">
                  Spotkajcie się niebawem ze swoim hufcowym i określcie mu swoje ambicje —
                  jaką kategorię chcielibyście zdobyć w tym roku — i zaplanujcie swoją pracę
                  tak, aby bez problemu wypełnić wszystkie wymagania i rozłożyć to w czasie
                  — żeby nic nie zaskoczyło Was po drodze.
                </p>

                <p className="card-text">
                  Po nowym roku spotkajcie się raz jeszcze — i sprawdźcie w połowie drogi jak
                  Wam idzie, być może Wasz plan będzie wymagał lekkiej korekty? Na końcu
                  spotkajcie się raz jeszcze — w maju — aby podsumować okres śródroczny i
                  omówić obozowe sprawy.
                </p>

                <p className="card-text">
                  Życzę Wam wszystkim, aby spełniły się Wasze aspiracje i abyście zdobyli takie
                  kategorie, jakie sobie wymarzyliście. A być może i zdobyli w przyszłym roku
                  miano Drużyny Rzeczypospolitej, Orlej czy Sokolej!
                </p>

                <p className="text-end mb-0">Czuwaj!</p>
                <p className="text-end fst-italic">szef Wydziału Harcerzy ZHR</p>
              </div>
            </div>
          </div>
        </div>
      </NavbarOverlay>
    );
  };
  
  export default Root;
  