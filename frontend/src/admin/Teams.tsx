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
      updateUsers();
    }
  }, [userinfo]);

  const [districts, setDistricts] = useState<Array<ShallowDistrict>>([{id: -1, name: "Wybierz chorągiew..."}]);
  const [selectedDistrict, setSelectedDistrict] = useState(-1);
  const [district, setDistrict] = useState<District|null>(null);
  const [newTeam, setNewTeam] = useState({name: "", shadow: false});

  const [users, setUsers] = useState<Array<{id: number; email: string}>>([]);
  const [newAccessGrants, setNewAccessGrant] = useState(new Map<number,{filtertext: string; show: boolean;}>());

  const updateUsers = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/users/shallow`);
      setUsers(res.data);
    } catch (err: any) {
      setUsers([]);
    }
  };

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

  const createTeam = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/admin/teams/`, {
        ...newTeam,
        districtId: selectedDistrict,
      });
      updateTeams();
    } catch (err: any) {
    }
    setNewTeam({name: "", shadow: false});
  };

  const disableEnableTeam = async (teamId: number, shadow: boolean) => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/teams/${teamId}`, {
        shadow: shadow,
      });
      updateTeams();
    } catch (err: any) {
    }
  };

  const setAccess = async (teamId: number, userId: number, access: boolean) => {
    try {
      const action = (access ? "grant" : "revoke");
      const res = await axios.patch(`${API_ROOT}/admin/teams/${action}/${userId}/on/${teamId}`);
      updateTeams();
    } catch (err: any) {
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
                  <button className="btn btn-danger" onClick={(e) => createTeam()}>Utwórz nową drużynę</button>
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
                    {!team.shadow ? <button className="btn btn-sm btn-danger" onClick={(e) => disableEnableTeam(team.id, true)}>Wyłącz</button> : <button className="btn btn-sm btn-dark" onClick={(e) => disableEnableTeam(team.id, false)}>Włącz</button>}
                  </div>
                  <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                    Dostęp mają:
                    <ul className="mb-0">
                      {team.owners.filter((u) => u.teamAccepted).map((user) => <li><div className="d-flex align-items-between">
                        <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                          {user.email} <br/>
                          <small style={{ fontSize: "0.7em", fontWeight: "bold" }}> Ostatnie logowanie: {(new Date(user.createdAt).toLocaleString('pl'))}</small>
                        </span>
                        <button className="btn btn-sm btn-danger" onClick={(e) => setAccess(team.id, user.id, false)}>Odbierz dostęp</button>
                      </div></li>)}
                      {!team.shadow && <li>
                        {newAccessGrants.get(team.id)?.show && <span>
                          Nadaj dostęp. Wyszukaj osobę po adresie e-mail:
                          <input className="form-control" placeholder="szukaj emaili..." value={newAccessGrants.get(team.id)?.filtertext} onChange={(e) => {let m = new Map(newAccessGrants); m.set(team.id, {...(m.get(team.id) === undefined ? {show: false, filtertext: ""} : m.get(team.id)) as any, filtertext: e.target.value}); setNewAccessGrant(m);}}></input>
                          <ul>
                            {users.filter((u) => {
                              const filtertext = newAccessGrants.get(team.id);
                              if(filtertext === undefined || filtertext.filtertext === "") return true;
                              return u.email.includes(filtertext.filtertext);
                            }).map((user, index, array) => {
                              if(array.length > 10){
                                if(index > 0) return;
                                return <li><i>wpisz więcej znaków do wyszukiwarki</i></li>
                              }
                              return <li>
                                {user.email} <button className="btn btn-sm btn-dark" onClick={(e) => {setAccess(team.id, user.id, true); setNewAccessGrant(new Map());}}>Nadaj uprawnienia</button>
                              </li>
                            })}
                          </ul>
                        </span>}
                        {!newAccessGrants.get(team.id)?.show && <button className="btn btn-dark btn-sm" onClick={(e) => {let m = new Map(newAccessGrants); m.set(team.id, {...(m.get(team.id) === undefined ? {show: false, filtertext: ""} : m.get(team.id)) as any, show: true}); setNewAccessGrant(m);}}>Dodaj osobę</button>}
                      </li>}
                    </ul>
                  </span>
                  {team.owners.filter((u) => !u.teamAccepted).length > 0 && <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                    Na dostęp oczekują:
                    <ul className="mb-0">
                      {team.owners.filter((u) => !u.teamAccepted).map((user) => <li><div className="d-flex align-items-between">
                        <span className="flex-grow-1">{user.email}</span>
                        <button className="btn btn-sm btn-dark" onClick={(e) => {setAccess(team.id, user.id, true);}}>Nadaj uprawnienia</button>
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
  