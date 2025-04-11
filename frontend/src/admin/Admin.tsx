import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { UserInfo } from "../App";
import Districts from "./Districts";
import Teams from "./Teams";

const API_ROOT = process.env.REACT_APP_API_URL;

export interface AdminMenu {
  id: number;
  name: string;
  level: 'TOPLEVEL'|'DISTRICT'|'UBER';
}

export interface CategorizationMenu {
  id: number;
  name: string;
  state: 'OPEN'|'FINISHED'|'DRAFT';
}

const Admin = ({userinfo} : {userinfo: UserInfo | null}) => {
    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER"){
              navigate("/", {replace: true}); // Kick users outta here
              return;
            }

            if(userinfo.role === "TOPLEVEL_COORDINATOR"){
              const roleFilteredMenus = menus.filter((menu) => menu.level === 'TOPLEVEL' || menu.level === 'DISTRICT');
              setAvailableMenus(roleFilteredMenus);
            }else if(userinfo.role === "DISTRICT_COORDINATOR"){
              const roleFilteredMenus = menus.filter((menu) => menu.level === 'DISTRICT');
              setAvailableMenus(roleFilteredMenus);
            }else{
              setAvailableMenus(menus);
            }

            updateCategorizations();
        }else{
          setAvailableMenus([{id: -100, name: "Ładowanie...", level: "DISTRICT"}]);
          setActiveMenu(-100);
        }
    }, [userinfo]);

    const menus = [
      {
        id: 50,
        name: "Chorągwie",
        level: "DISTRICT" as ('TOPLEVEL'|'DISTRICT'|'UBER'),
      },
      {
        id: 60,
        name: "Drużyny",
        level: "DISTRICT" as ('TOPLEVEL'|'DISTRICT'|'UBER'),
      },
      {
        id: 70,
        name: "Użytkownicy",
        level: "TOPLEVEL" as ('TOPLEVEL'|'DISTRICT'|'UBER'),
      },
      {
        id: 80,
        name: "Administracyjne",
        level: "UBER" as ('TOPLEVEL'|'DISTRICT'|'UBER'),
      },
    ];
    const [availableMenus, setAvailableMenus] = useState<Array<AdminMenu>>(menus);
    const [activeMenu, setActiveMenu] = useState(menus[0].id);

    const [availableCategorizations, setAvailableCategorizations] = useState<Array<CategorizationMenu>>([]);
    const renderableCategorizations = [
      {
        id: -1,
        name: "Nowa kategoryzacja",
        state: 'OPEN' as ('OPEN'|'FINISHED'|'DRAFT'),
      },
      ...availableCategorizations,
    ];
    const [activeCategorization, setActiveCategorization] = useState(0);

    const [displayState, setDisplayState] = useState<'SETTINGS'|'CATEGORIZATIONS'>('SETTINGS');

    useEffect(() => {
      if(availableMenus.find((v) => v.id === activeMenu) === undefined){
        if(availableMenus.length > 0) setActiveMenu(availableMenus[0].id);
      }
    }, [availableMenus]);

    useEffect(() => {
      if(availableCategorizations.find((v) => v.id === activeCategorization) === undefined){
        if(availableCategorizations.length > 0) setActiveCategorization(availableCategorizations[0].id);
      }
    }, [availableCategorizations]);

    const updateCategorizations = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/admin/categorization/shallow`);
        setAvailableCategorizations(res.data);
      } catch (err: any) {
        setAvailableCategorizations([]);
      }
    };    

    return (
      <NavbarOverlay userinfo={userinfo}>
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="d-flex flex-column flex-lg-row h-100">
            {/* Desktop Sidebar */}
            <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
              <div className="p-3 border-bottom">
                <h4 className="mb-3">Panel administratora</h4>
                <ul className="nav nav-underline">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${displayState === "SETTINGS" ? 'active' : 'text-muted'}`}
                      onClick={() => setDisplayState("SETTINGS")}
                    >
                      Ustawienia
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${displayState === "CATEGORIZATIONS" ? 'active' : 'text-muted'}`}
                      onClick={() => setDisplayState("CATEGORIZATIONS")}
                    >
                      Kategoryzacja
                    </button>
                  </li>
                </ul>
              </div>

              {displayState === "SETTINGS" ? 
              <div className="flex-grow-1 overflow-auto">
              {availableMenus.map(menu => {
                return (
                <div 
                  key={menu.id}
                  className={`p-3 border-bottom ${activeMenu === menu.id ? 'bg-white' : ''}`}
                  onClick={() => setActiveMenu(menu.id)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">{menu.name}</h6>
                  </div>
                </div>
              )})}
              </div>
              :
              <div className="flex-grow-1 overflow-auto">
              {renderableCategorizations.map(cat => {
                return (
                <div 
                  key={cat.id}
                  className={`p-3 border-bottom ${activeCategorization === cat.id ? 'bg-white' : ''}`}
                  onClick={() => setActiveCategorization(cat.id)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    {cat.id === -1 ? 
                    <div className="text-center" style={{width: "100%"}}><button className="btn btn-dark mb-0">Nowa kategoryzacja</button></div>
                    :
                    <h6 className="mb-0">
                      {cat.name}
                      {cat.state === "OPEN" ? <span className="text-success"> [AKTYWNA]</span> :
                       cat.state === "FINISHED" ? <span className="text-danger"> [ZAKOŃCZONA]</span> :
                       cat.state === "DRAFT" ? <span className="text-secondary"> [DRAFT - ukryta]</span> :
                      <></>}
                    </h6>}
                  </div>
                </div>
              )})}
              </div>}

            </div>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto p-4">
              {/* Mobile Header */}
              <div className="d-lg-none mb-4">
                <h4 className="mb-3">Panel administratora</h4>
                <div className="d-flex justify-content-between mb-3">
                  <ul className="nav nav-underline">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${displayState === "SETTINGS" ? 'active' : 'text-muted'}`}
                        onClick={() => setDisplayState("SETTINGS")}
                      >
                        Ustawienia
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${displayState === "CATEGORIZATIONS" ? 'active' : 'text-muted'}`}
                        onClick={() => setDisplayState("CATEGORIZATIONS")}
                      >
                        Kategoryzacja
                      </button>
                    </li>
                  </ul>
                </div>
                
                {displayState === "SETTINGS" ? <div className="d-flex overflow-auto mb-3">
                  {availableMenus.map(menu => (
                    <button
                      key={menu.id}
                      className={`btn btn-outline-primary me-2 ${activeMenu === menu.id ? 'active' : ''}`}
                      onClick={() => setActiveMenu(menu.id)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {menu.name}
                    </button>
                  ))}
                </div>
                :
                <div className="d-flex overflow-auto mb-3">
                  {availableCategorizations.map(cat => (
                    <button
                      key={cat.id}
                      className={`btn btn-outline-primary me-2 ${activeCategorization === cat.id ? 'active' : ''}`}
                      onClick={() => setActiveCategorization(cat.id)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {cat.name}
                      {cat.state === "OPEN" ? <span className="text-success"> [A]</span> :
                       cat.state === "FINISHED" ? <span className="text-danger"> [Z]</span> :
                       cat.state === "DRAFT" ? <span className="text-secondary"> [D]</span> :
                      <></>}
                    </button>
                  ))}
                </div>}

              </div>

              {displayState === "SETTINGS" ? 
              <>
                {activeMenu === 50 && <Districts userinfo={userinfo} />}
                {activeMenu === 60 && <Teams userinfo={userinfo} />}
              </>
              :
              <>
                {/* Top Stats Cards */}
                {/*!(initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length) && 
                  <StatsBar categorizationDetails={categorizationDetails} userinfo={userinfo} categories={tasklist} myTasksMode={showStarredOnly} />
                */}
              </>}
            </div>
          </div>

          <style>{`
            .nav-underline .nav-link.active {
              border-bottom: 2px solid #0d6efd;
              color: #0d6efd !important;
            }
            .dashboard-layout {
              overflow: hidden;
            }
          `}</style>
        </div>
      </NavbarOverlay>
    );
  };
  
  export default Admin;
  