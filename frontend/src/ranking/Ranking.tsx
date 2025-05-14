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
  points: number;
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
    const [rankingDistrict, setRankingDistrict] = useState<string>("");
    const [ranking, setRanking] = useState<Array<Team>>([]);
    const [rankingByPts, setRankingByPts] = useState<Array<Team>>([]);
    const [sortByPts, setSortByPts] = useState(false);

    useEffect(() => {
      updateRanking();
    }, [rankingYear]);

    useEffect(() => {
      setRankingByPts(ranking.sort((a,b) => {
        if(a.points > b.points) return -1;
        if(b.points < b.points) return 1;
        return a.name.localeCompare(b.name);
      }));
    }, [ranking]);

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

    const displayRanking = sortByPts ? rankingByPts : ranking;
    

    return (
      <NavbarOverlay userinfo={userinfo}>
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="container-fluid row ps-0 pe-0 mt-5">
            <div className="col-12 col-lg-8 offset-lg-2">
              <ul className="list-group">
                <li className="list-group-item list-group-item-info d-flex justify-content-center bg-dark text-center text-white position-relative">
                  <select className="form-control position-absolute ms-2" style={{left: "0px", width: "fit-content", maxWidth: "200px"}} value={rankingDistrict.toString()} onChange={(e) => {setRankingDistrict(e.target.value);}} required>
                    <option value="">Wszystkie chorągwie</option>
                    {[...new Set(ranking.map(r => r.district))].map((district) => {
                      return <option value={district}>{district}</option>;
                    })}
                  </select>
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
                        <th scope="col" className="text-center">
                          <span className={"sortable-header nowrap " + (sortByPts ? 'active' : '')} onClick={(e) => {setSortByPts(true)}}>
                            Punkty 
                            <i className={`bi ${sortByPts ? 'bi-caret-down-fill' : 'bi-caret-down'}`} />
                          </span>
                        </th>
                        <th scope="col" className="text-center">
                          <span className={"sortable-header nowrap " + (!sortByPts ? 'active' : '')} onClick={(e) => {setSortByPts(false)}}>
                            Kategoria 
                            <i className={`bi ${!sortByPts ? 'bi-caret-down-fill' : 'bi-caret-down'}`} />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(rankingDistrict === "" ? displayRanking : displayRanking.filter((r) => r.district === rankingDistrict)).map((entry, index) => {
                        return <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{entry.name}</td>
                            <td className="text-center" style={{whiteSpace: "nowrap"}}>
                              {entry.points.toFixed(0)}
                            </td>
                            <td className="pb-0 pt-1 text-center">
                              <img className={"img-src-" + entry.category.toLowerCase()} style={{width: '35px', height: '35px'}}></img>
                            </td>
                          </tr>
                        </>;
                      })}
                    </tbody>
                  </table>
                  <p className="text-center mb-2"><i>Ranking jest aktualizowany raz na dobę.</i></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </NavbarOverlay>
    );
  };
  
  export default Ranking;
  