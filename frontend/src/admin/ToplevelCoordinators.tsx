import 'bootstrap/js/dist/tab';
import { UserInfo } from '../App';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_ROOT = process.env.REACT_APP_API_URL;

export interface ToplevelCoordinator {
  id: number;
  email: string;
  createdAt: string;
  lastLogin: string;
};

const ToplevelCoordinators = ({userinfo, users} : {userinfo: UserInfo | null; users: Array<{id: number; email: string}>}) => {
  useEffect(() => {
    if(userinfo !== null){
      updateToplevelCoordinators();
    }
  }, [userinfo]);

  const [toplevelCoordinators, setToplevelCoordinators] = useState<Array<ToplevelCoordinator>>([]);
  const [showNewCoordinator, setShowNewCoordinator] = useState(false);
  const [filtertext, setFiltertext] = useState("");

  const updateToplevelCoordinators = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/users/admins/TOPLEVEL_COORDINATOR`);
      setToplevelCoordinators(res.data);
    } catch (err: any) {
      setToplevelCoordinators([]);
    }
  };

  const makeToplevelCoordinator = async (userId: number, access: boolean) => {
    try {
      const permissions = (access ? "TOPLEVEL_COORDINATOR" : "USER");
      const res = await axios.patch(`${API_ROOT}/admin/users/${userId}/permissions/${permissions}`);
      updateToplevelCoordinators();
    } catch (err: any) {
    }
  };

  return (
    <div className="row row-cols-1 g-4">
      <div className="col">
        <div className="card h-100 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Koordynatorzy krajowi</h5>
          </div>
          <div className="card-body p-0">
            <div className="list-group">
              {toplevelCoordinators.map((admin) => <div key={admin.id} className="list-group-item d-flex align-items-center">
                <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                  {admin.email} <br/>
                  <small style={{ fontSize: "0.7em", fontWeight: "bold" }}>Ostatnie logowanie: {(new Date(admin.lastLogin)).toLocaleDateString('pl')}</small>
                </span>
                <button className="btn btn-sm btn-danger" onClick={(e) => makeToplevelCoordinator(admin.id, false)}>Usuń dostęp</button>
              </div>)}
              <div key="nowy" className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                {showNewCoordinator && <span>
                  Nadaj dostęp. Wyszukaj osobę po adresie e-mail:
                  <input className="form-control" placeholder="szukaj emaili..." value={filtertext} onChange={(e) => setFiltertext(e.target.value)}></input>
                  <ul>
                    {users.filter((u) => {
                      if(filtertext === "") return true;
                      return u.email.includes(filtertext);
                    }).map((user, index, array) => {
                      if(array.length > 10){
                        if(index > 0) return;
                        return <li><i>wpisz więcej znaków do wyszukiwarki</i></li>
                      }
                      return <li>
                        {user.email} <button className="btn btn-sm btn-dark" onClick={(e) => {makeToplevelCoordinator(user.id, true); setFiltertext(""); setShowNewCoordinator(false);}}>Nadaj uprawnienia</button>
                      </li>
                    })}
                  </ul>
                </span>}
                {!showNewCoordinator && <button className="btn btn-dark" onClick={(e) => setShowNewCoordinator(true)}>Dodaj osobę</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default ToplevelCoordinators;
  