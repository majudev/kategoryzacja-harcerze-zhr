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
      locked: boolean;
  }[];
  admins: {
    id: number;
    email: string;
    createdAt: string;
    lastLogin: string;
  }[];
};

const Districts = ({userinfo, users} : {userinfo: UserInfo | null; users: Array<{id: number; email: string}>}) => {
  useEffect(() => {
    if(userinfo !== null){
      updateDistricts();
    }
  }, [userinfo]);

  const [districts, setDistricts] = useState<Array<District>>([]);
  const [newDistrict, setNewDistrict] = useState<{name: string; shadow: boolean; autoaccept: boolean;}>({name: "", shadow: false, autoaccept: true});
  const [newAccessGrants, setNewAccessGrant] = useState(new Map<number,{filtertext: string; show: boolean;}>());

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

  const shadowDistrict = async (districtId: number, shadow: boolean) => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/districts/${districtId}`, {
        shadow: shadow,
      });
      updateDistricts();
    } catch (err: any) {
    }
  };

  const autoacceptDistrict = async (districtId: number, autoaccept: boolean) => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/districts/${districtId}`, {
        autoaccept: autoaccept,
      });
      updateDistricts();
    } catch (err: any) {
    }
  };

  const makeDistrictAdmin = async (districtId: number, userId: number, access: boolean) => {
    try {
      const permissions = (access ? "DISTRICT_COORDINATOR" : "USER");
      const res = await axios.patch(`${API_ROOT}/admin/users/${userId}/permissions/${permissions}/${districtId}`);
      updateDistricts();
    } catch (err: any) {
    }
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
                      <input className="form-check-input" type="checkbox" checked={district.shadow} onClick={() => {shadowDistrict(district.id, !district.shadow)}} />
                      <label className="form-check-label">Ukryta</label>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={district.autoaccept} onClick={() => {autoacceptDistrict(district.id, !district.autoaccept)}} />
                      <label className="form-check-label">Pozwól zapisywać się do drużyn bez akceptacji</label>
                    </div>
                  </div>
                </div>
                <div className="list-group">
                  <h3 className="text-center mt-1">Koordynatorzy</h3>
                  {district.admins.map((admin) => <div key={admin.id} className="list-group-item d-flex align-items-center">
                    <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                      {admin.email} <br/>
                      <small style={{ fontSize: "0.7em", fontWeight: "bold" }}>Ostatnie logowanie: {(new Date(admin.lastLogin)).toLocaleDateString('pl')}</small>
                    </span>
                    <button className="btn btn-sm btn-danger" onClick={(e) => makeDistrictAdmin(district.id, admin.id, false)}>Usuń dostęp</button>
                  </div>)}
                  <div key="nowy" className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                    {newAccessGrants.get(district.id)?.show && <span>
                      Nadaj dostęp. Wyszukaj osobę po adresie e-mail:
                      <input className="form-control" placeholder="szukaj emaili..." value={newAccessGrants.get(district.id)?.filtertext} onChange={(e) => {let m = new Map(newAccessGrants); m.set(district.id, {...(m.get(district.id) === undefined ? {show: false, filtertext: ""} : m.get(district.id)) as any, filtertext: e.target.value}); setNewAccessGrant(m);}}></input>
                      <ul>
                        {users.filter((u) => {
                          const filtertext = newAccessGrants.get(district.id);
                          if(filtertext === undefined || filtertext.filtertext === "") return true;
                          return u.email.includes(filtertext.filtertext);
                        }).map((user, index, array) => {
                          if(array.length > 10){
                            if(index > 0) return;
                            return <li><i>wpisz więcej znaków do wyszukiwarki</i></li>
                          }
                          return <li>
                            {user.email} <button className="btn btn-sm btn-dark" onClick={(e) => {makeDistrictAdmin(district.id, user.id, true); setNewAccessGrant(new Map());}}>Nadaj uprawnienia</button>
                          </li>
                        })}
                      </ul>
                    </span>}
                    {!newAccessGrants.get(district.id)?.show && <button className="btn btn-dark" onClick={(e) => {let m = new Map(newAccessGrants); m.set(district.id, {...(m.get(district.id) === undefined ? {show: false, filtertext: ""} : m.get(district.id)) as any, show: true}); setNewAccessGrant(m);}}>Dodaj osobę</button>}
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
  