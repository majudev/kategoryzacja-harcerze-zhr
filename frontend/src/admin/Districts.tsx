import 'bootstrap/js/dist/tab';
import { UserInfo } from '../App';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_ROOT = process.env.REACT_APP_API_URL;

export interface District {
  id: number;
  name: string;
  shadow: boolean;
  autoaccept: boolean;
  teams: {
      id: number;
      name: string;
      shadow: boolean;
      createdAt: Date;
      owners: {
          id: number;
          email: string;
          createdAt: string;
          lastLogin: string;
          teamAccepted: boolean;
      }[];
  }[];
  admins: {
    id: number;
    email: string;
    createdAt: string;
    lastLogin: string;
  }[];
};

const Districts = ({userinfo} : {userinfo: UserInfo | null; }) => {
  useEffect(() => {
    if(userinfo !== null){
      updateDistricts();
    }
  }, [userinfo]);

  const [districts, setDistricts] = useState<Array<District>>([]);
  const [newDistrict, setNewDistrict] = useState<{name: string; shadow: boolean; autoaccept: boolean;}>({name: "", shadow: false, autoaccept: true});

  const updateDistricts = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/districts`);
      setDistricts(res.data);
    } catch (err: any) {
      setDistricts([]);
    }
  };

  const createDistrict = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/admin/districts/`, {
        ...newDistrict
      });
      updateDistricts();
    } catch (err: any) {
    }
    setNewDistrict({name: "", shadow: false, autoaccept: true});
  };

  return (
    <div className="row row-cols-1 row-cols-xl-2 g-4">
      <div key="nowa" className="col">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-center">Utwórz nową chorągiew</h5>
          </div>
          <div className="card-body p-0">
          <div className="list-group">
              <div className="list-group-item">
                <div>
                  <label className="form-label">Nazwa:</label>
                  <input className="form-control" type="text" value={newDistrict.name} onChange={(e) => setNewDistrict({...newDistrict, name: e.target.value})}/>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" checked={newDistrict.shadow} onChange={(e) => setNewDistrict({...newDistrict, shadow: e.target.checked})}/>
                  <label className="form-check-label">Ukryta</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" checked={newDistrict.autoaccept} onChange={(e) => setNewDistrict({...newDistrict, autoaccept: e.target.checked})} />
                  <label className="form-check-label">Pozwól zapisywać się do drużyn bez akceptacji</label>
                </div>
              </div>
              <div className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0'}}>
                <button className="btn btn-danger" onClick={(e) => createDistrict()}>Utwórz nową chorągiew</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {districts.map((district) => {
        return (
          <div key={district.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{district.name}</h5>
                <small>
                  {district.teams.length} drużyn
                </small>
              </div>
              <div className="card-body p-0">
                <div className="list-group">
                  <div className="list-group-item" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                    {/*<div>
                      <label className="form-label">Nazwa:</label>
                      <input className="form-control" type="text" value={district.name}></input>
                    </div>*/}
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={district.shadow} />
                      <label className="form-check-label">Ukryta</label>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={district.autoaccept} />
                      <label className="form-check-label">Pozwól zapisywać się do drużyn bez akceptacji</label>
                    </div>
                  </div>
                </div>
                {/*<div className="list-group">
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
                </div>*/}
                <div className="list-group">
                  <h3 className="text-center mt-1">Koordynatorzy</h3>
                  {district.admins.map((admin) => <div key={admin.id} className="list-group-item d-flex align-items-center">
                    <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                      {admin.email}
                      <small style={{ fontSize: "0.7em", fontWeight: "bold" }}>Ostatnie logowanie: {(new Date(admin.lastLogin)).toLocaleDateString('pl')}</small>
                      <button className="btn btn-sm btn-danger">Usuń dostęp</button>
                    </span>
                  </div>)}
                  <div key="nowy" className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                    <button className="btn btn-dark">Dodaj nowego</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
  
export default Districts;
  