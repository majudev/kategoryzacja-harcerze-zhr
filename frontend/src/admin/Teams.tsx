import 'bootstrap/js/dist/tab';
import { UserInfo } from '../App';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { District } from './Districts';

const API_ROOT = process.env.REACT_APP_API_URL;

interface ShallowDistrict {
  id: number;
  name: string;
};

const Teams = ({userinfo} : {userinfo: UserInfo | null; }) => {
  useEffect(() => {
    if(userinfo !== null){
      updateDistricts();
    }
  }, [userinfo]);

  const [districts, setDistricts] = useState<Array<ShallowDistrict>>([{id: -1, name: "Wybierz chorągiew..."}]);
  const [selectedDistrict, setSelectedDistrict] = useState(-1);
  const [district, setDistrict] = useState<District|null>(null);
  const [newTeam, setNewTeam] = useState({name: "", shadow: false});

  useEffect(() => {
    if(selectedDistrict > 0){
      updateTeams();
    }
  }, [selectedDistrict]);

  const updateDistricts = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/districts/shallow`);
      setDistricts([{id: -1, name: "Wybierz chorągiew..."}, ...res.data]);
    } catch (err: any) {
      setDistricts([]);
    }
  };

  const updateTeams = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/districts/${selectedDistrict}`);
      setDistrict(res.data);
    } catch (err: any) {
      setDistrict(null);
    }
  };

  return (
    <>
      <div className="mb-4">
        <select className="form-control" value={selectedDistrict} onChange={(e) => setSelectedDistrict(parseInt(e.target.value))}>
          {districts.map((district) => <option value={district.id} disabled={district.id < 0}>{district.name}</option>)}
        </select>
      </div>
      <div className="row row-cols-1 g-4">
        {district !== null && <div key="nowa" className="col">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-center">Utwórz nową drużynę</h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group">
                <div className="list-group-item">
                  <div>
                    <label className="form-label">Nazwa:</label>
                    <input className="form-control" type="text" value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}/>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={newTeam.shadow} onChange={(e) => setNewTeam({...newTeam, shadow: e.target.checked})}/>
                    <label className="form-check-label">Ukryta</label>
                  </div>
                </div>
                <div className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                  <button className="btn btn-danger">Utwórz nową drużynę</button>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {district !== null && <div key={district.id} className="col">
          <div className="card h-100 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{district.name}</h5>
              <small>
                {district.teams.length} drużyn
              </small>
            </div>
            <div className="card-body p-0">
              <div className="list-group">
                <h3 className="text-center mt-1">Drużyny</h3>
                {district.teams.map((team) => <div key={team.id} className="list-group-item" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0'}}>
                  <div className="d-flex align-items-between mb-2">
                    <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                      <b>{team.name}</b> {team.shadow && <i> (wyłączona)</i>}<br/>
                      <small style={{ fontSize: "0.7em", fontWeight: "bold" }}>Utworzono: {(new Date(team.createdAt)).toLocaleDateString('pl')}</small>
                    </span>
                    {!team.shadow ? <button className="btn btn-sm btn-danger">Wyłącz</button> : <button className="btn btn-sm btn-dark">Włącz</button>}
                  </div>
                  <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                    Dostęp mają:
                    <ul className="mb-0">
                      {team.owners.filter((u) => u.teamAccepted).map((user) => <li><div className="d-flex align-items-between">
                        <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                          {user.email} <br/>
                          <small style={{ fontSize: "0.7em", fontWeight: "bold" }}> Ostatnie logowanie: {(new Date(user.createdAt).toLocaleString('pl'))}</small>
                        </span>
                        <button className="btn btn-sm btn-danger">Odbierz dostęp</button>
                      </div></li>)}
                    </ul>
                  </span>
                  {team.owners.filter((u) => !u.teamAccepted).length > 0 && <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                    Na dostęp oczekują:
                    <ul className="mb-0">
                      {team.owners.filter((u) => !u.teamAccepted).map((user) => <li><div className="d-flex align-items-between">
                        <span className="flex-grow-1">{user.email}</span>
                        <button className="btn btn-sm btn-dark">Przyznaj dostęp</button>
                      </div></li>)}
                    </ul>
                  </span>}
                </div>)}
              </div>
            </div>
          </div>
        </div>}
      </div>
    </>
  );
};
  
export default Teams;
  