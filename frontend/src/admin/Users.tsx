import 'bootstrap/js/dist/tab';
import { UserInfo } from '../App';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_ROOT = process.env.REACT_APP_API_URL;

interface User {
  id: number;
  email: string;
  activated: boolean;
  createdAt: Date;
  lastLogin: Date;

  role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN";
  districtAdminId: number | null;
  districtAdmin: {
    name: string;
  } | null;

  teamId: number;
  team: {
    name: string;
    district: {
      name: string;
    };
  } | null;
  teamAccepted: boolean;
}

const Users = ({userinfo} : {userinfo: UserInfo | null; }) => {
  useEffect(() => {
    if(userinfo !== null){
      updateUsers();
    }
  }, [userinfo]);

  const [users, setUsers] = useState<Array<User>>([]);

  const updateUsers = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/users/`);
      setUsers(res.data);
    } catch (err: any) {
      setUsers([]);
    }
  };

  const activateUser = async (userId: number) => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/users/activate/${userId}`);
      updateUsers();
    } catch (err: any) {
    }
  };

  const [namefilter, setNamefilter] = useState("");
  const [districtfilter, setDistrictfilter] = useState("");
  const [statefilter, setStatefilter] = useState<"ACTIVATED"|"AWAITING"|"ALL">("ALL");
  const [rolefilter, setRolefilter] = useState<"USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"|"ALL">("ALL");

  const userlist = users.filter((user) => {
    if(namefilter.length === 0) return true;
    return user.email.includes(namefilter);
  }).filter((user) => {
    if(districtfilter === "") return true;
    return user.team && user.team.district.name === districtfilter;
  }).filter((user) => {
    if(statefilter === 'ALL') return true;
    if(statefilter === 'AWAITING') return !user.activated;
    return user.activated;
  }).filter((user) => {
    if(rolefilter === 'ALL') return true;
    return user.role === rolefilter;
  });

  return (
    <div className="row row-cols-1 g-4">
      <div key="nowa" className="col">
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0 text-center">Administruj użytkownikami</h5>
          </div>
          <div className="card-body p-3 ps-4 pe-4">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="nowrap w-100">Adres e-mail</th>
                  <th scope="col" className="nowrap text-center">Okręg</th>
                  <th scope="col" className="nowrap text-center">Stan</th>
                  <th scope="col" className="nowrap text-center">Utworzono</th>
                  <th scope="col" className="nowrap text-center">Ostatnie logowanie</th>
                  <th scope="col" className="nowrap text-center">Uprawnienia</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input className="form-control" value={namefilter} onChange={(e) => setNamefilter(e.target.value)}/></td>
                  <td>
                    <select className="form-control" value={districtfilter} onChange={(e) => setDistrictfilter(e.target.value)}>
                      <option value="">Wszystkie</option>
                      {users.map(u => {
                        if(u.team === null) return;
                        return <option value={u.team.district.name}>{u.team.district.name}</option>;
                      })}
                    </select>
                  </td>
                  <td>
                    <select className="form-control" value={statefilter} onChange={(e) => setStatefilter(e.target.value as "ACTIVATED"|"AWAITING"|"ALL")}>
                      <option value="ALL">Wszyscy</option>
                      <option value="ACTIVATED">Aktywowani</option>
                      <option value="AWAITING">Oczekujący</option>
                    </select>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <select className="form-control" value={rolefilter} onChange={(e) => setRolefilter(e.target.value as "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"|"ALL")}>
                      <option value="ALL">Wszyscy</option>
                      <option value="ADMIN">Administratorzy</option>
                      <option value="TOPLEVEL_COORDINATOR">Koord. kraj.</option>
                      <option value="TOPLEVEL_DISTRICT">Koord. chor.</option>
                      <option value="USER">Użytkownicy</option>
                    </select>
                  </td>
                </tr>
                {userlist.map((user) => {
                  return <tr>
                    <td>{user.email}</td>
                    <td>{user.team !== null ?
                     <>{user.team.district.name}</>
                     : <i>nie wybrał drużyny</i>
                    }</td>
                    <td>{user.activated ? 'aktywny' : <button className="btn btn-sm btn-dark" onClick={(e) => activateUser(user.id)}>Aktywuj</button>}</td>
                    <td><i><small>{(new Date(user.createdAt)).toLocaleDateString('pl')}</small></i></td>
                    <td><i><small>{(new Date(user.lastLogin)).toLocaleString('pl')}</small></i></td>
                    <td>
                      {user.role === 'ADMIN' ?
                      <>Administrator</> :
                      user.role === 'TOPLEVEL_COORDINATOR' ?
                      <>Koordynator krajowy</> :
                      user.role === 'DISTRICT_COORDINATOR' ?
                      <>Koordynator chorągwi<br/>{user.districtAdmin?.name}</> :
                      <>Użytkownik</>}
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Users;
  