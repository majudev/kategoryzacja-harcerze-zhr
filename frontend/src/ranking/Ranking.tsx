import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { UserInfo } from "../App";

const API_ROOT = process.env.REACT_APP_API_URL;

export interface Team {
  name: string;
  category: 'POLOWA' | 'LESNA' | 'PUSZCZANSKA';
  tokens: {
    polowa: number;
    lesna: number;
    puszczanska: number;
  },
  district: string;
}

const Ranking = ({userinfo} : {userinfo: UserInfo | null}) => {
    const navigate = useNavigate();

    // NO ROUTE CHECKING - this is available for everyone
    useEffect(() => {
      updateYears();
    }, []);

    const [rankingYears, setRankingYears] = useState<Array<{id: number; name: string}>>([{id: -1, name: 'Najnowszy'}]);
    const [rankingYear, setRankingYear] = useState<number>(-1);
    const [ranking, setRanking] = useState<Array<Team>>([]);

    useEffect(() => {
      updateRanking();
    }, [rankingYear]);

    const updateYears = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/ranking/years`);
        if(res.data.length > 0){
          setRankingYears(res.data);
          setRankingYear(res.data[0].id);
        }else updateRanking();
      } catch (err: any) {
        updateRanking();
      }
    };

    const updateRanking = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/ranking${rankingYear > 0 ? ('/' + rankingYear) : ''}`);
        setRanking(res.data);
      } catch (err: any) {
        setRanking([]);
      }
    };
    

    return (
      <NavbarOverlay userinfo={userinfo}>
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="container-fluid row ps-0 pe-0 mt-5">
            <div className="col-12 col-lg-8 offset-lg-2">
              <ul className="list-group">
                <li className="list-group-item list-group-item-info d-flex justify-content-center bg-dark text-center text-white position-relative">
                  <h4 className="mb-1 mt-1">Ranking</h4>
                  <select className="form-control position-absolute me-2" style={{right: "0px", width: "fit-content"}} value={rankingYear.toString()} onChange={(e) => {setRankingYear(Number.parseInt(e.target.value));}} required>
                    {rankingYears.map((year) => {
                      return <option value={year.id}>{year.name}</option>;
                    })}
                  </select>
                </li>
                <li className="list-group-item">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center">#</th>
                        <th scope="col" style={{width: "100%"}}>Nazwa drużyny</th>
                        <th scope="col" className="text-center">Symbole</th>
                        <th scope="col" className="text-center">Kategoria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((entry, index) => {
                        return <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{entry.name}</td>
                            <td className="text-center" style={{whiteSpace: "nowrap"}}>
                              {(entry.tokens !== undefined ? <>
                                <span className="badge bg-primary rounded-pill me-1">{entry.tokens.polowa}</span>
                                <span className="badge bg-success rounded-pill me-1">{entry.tokens.lesna}</span>
                                <span className="badge bg-danger rounded-pill">{entry.tokens.puszczanska}</span>
                              </> : <span>-</span>)}
                            </td>
                            <td className="pb-0 pt-1 text-center">
                              <img className={"img-src-" + entry.category.toLowerCase()} style={{width: '35px', height: '35px'}}></img>
                            </td>
                          </tr>
                        </>;
                      })}
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </NavbarOverlay>
    );
  };
  
  export default Ranking;
  