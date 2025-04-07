import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { UserInfo, Category, Task } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const Sidebar = ({type, userinfo, renderableCategories, initialLock, myTasksMode, setMyTasksMode, activeCategory, setActiveCategory} : {type: "desktop"|"mobile"; userinfo: UserInfo | null; renderableCategories: Array<Category>; initialLock: boolean; myTasksMode: boolean; setMyTasksMode: React.Dispatch<React.SetStateAction<boolean>>; activeCategory: number; setActiveCategory: React.Dispatch<React.SetStateAction<number>>}) => {
    const categories = renderableCategories.filter((cat) => cat.id > 0);
    const polowa = categories.filter((taskGroup) => taskGroup.achievedSymbol === 'POLOWA').length;
    const lesna = categories.filter((taskGroup) => taskGroup.achievedSymbol === 'LESNA').length;
    const puszczanska = categories.filter((taskGroup) => taskGroup.achievedSymbol === 'PUSZCZANSKA').length;

    // Desktop sidebar
    if(type === "desktop") return (
      <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
        <div className="p-3 border-bottom">
          <h4 className="mb-3">Arkusz śródroczny</h4>
          <ul className="nav nav-underline">
            {!initialLock && <li className="nav-item">
              <button
                className={`nav-link ${myTasksMode ? 'active' : 'text-muted'}`}
                onClick={() => setMyTasksMode(true)}
              >
                Moje zadania
              </button>
            </li>}
            <li className="nav-item">
              <button
                className={`nav-link ${!myTasksMode ? 'active' : 'text-muted'}`}
                onClick={() => setMyTasksMode(false)}
              >
                Wszystkie zadania
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-grow-1 overflow-auto">
          {(initialLock ? renderableCategories.filter(cat => cat.id === -1) : renderableCategories).map(cat => {
            const collectedSplitPoints = cat.collectedSplitPoints;
            const maxSplitPoints = cat.maxSplitPoints;
            const maxFilteredSplitPoints = cat.maxFilteredSplitPoints;
            const maxSplitPointsAdjusted = myTasksMode ? maxFilteredSplitPoints : maxSplitPoints;

            return (
            <div 
              key={cat.id}
              className={`p-3 border-bottom ${activeCategory === cat.id ? 'bg-white' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {cat.id === -1 && !initialLock && <i className="bi bi-check-circle-fill" style={{ color: 'green', marginRight: '8px' }}></i>}
                  {cat.id > 0 && <img className={cat.achievedSymbol === "PUSZCZANSKA" ? "img-src-puszczanska" : cat.achievedSymbol === "LESNA" ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px', marginRight: '8px' }} />}
                  {cat.name}
                </h6>
                {cat.id !== 0 ?
                  <span className="badge bg-primary rounded-pill">
                    {cat.id === -1 ?
                    <>{cat.tasks.filter(t => t.value).length}/{cat.tasks.length}</>
                    :
                    <>{collectedSplitPoints}/{maxSplitPointsAdjusted}</>
                    }
                  </span>
                  : // TODO: Calculate real token values
                  <div className="d-flex justify-content-center">
                    <span className="badge bg-primary rounded-pill me-1">{polowa}</span>
                    <span className="badge bg-success rounded-pill me-1">{lesna}</span>
                    <span className="badge bg-danger rounded-pill">{puszczanska}</span>
                  </div>
                }
              </div>
              {cat.id !== 0 && <div className="progress mt-2" style={{height: '3px', position: 'relative', overflow: "visible"}}>
                {cat.id === -1 ?
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${cat.tasks.length > 0 ? ((cat.tasks.filter(t => t.value).length / cat.tasks.length) * 100) : 0}%`}}
                />
                :
                <>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{width: `${maxSplitPointsAdjusted > 0 ? Math.min((collectedSplitPoints / maxSplitPointsAdjusted), (cat.lesnaThreshold / maxSplitPointsAdjusted))*100 : 0}%`}}
                  />
                  <div 
                    className="progress-bar bg-success" 
                    style={{width: `${maxSplitPointsAdjusted > 0 ? Math.min(((collectedSplitPoints - cat.lesnaThreshold) / maxSplitPointsAdjusted), ((cat.puszczanskaThreshold - cat.lesnaThreshold) / maxSplitPointsAdjusted))*100 : 0}%`}}
                  />
                  <div 
                    className="progress-bar bg-danger" 
                    style={{width: `${maxSplitPointsAdjusted > 0 ? Math.min(((collectedSplitPoints - cat.puszczanskaThreshold) / maxSplitPointsAdjusted), ((maxSplitPointsAdjusted - cat.puszczanskaThreshold) / maxSplitPointsAdjusted))*100 : 0}%`}}
                  />
                  {(cat.lesnaThreshold / maxSplitPointsAdjusted) <= 1 && <div className="bg-success progress-bar-marker"
                    style={{
                      left: `${(cat.lesnaThreshold / maxSplitPointsAdjusted) * 100}%`,
                    }}
                  />}
                  {(cat.puszczanskaThreshold / maxSplitPointsAdjusted) <= 1 && <div className="bg-danger progress-bar-marker"
                    style={{
                      left: `${(cat.puszczanskaThreshold / maxSplitPointsAdjusted) * 100}%`,
                    }}
                  />}
                </>}
              </div>}
            </div>
          )})}
        </div>
      </div>
    );
    
    // Mobile header
    return (
      <div className="d-lg-none mb-4">
              <h4 className="mb-3">Arkusz śródroczny</h4>
              <div className="d-flex justify-content-between mb-3">
                <ul className="nav nav-underline">
                  {!initialLock &&<li className="nav-item">
                    <button
                      className={`nav-link ${myTasksMode ? 'active' : 'text-muted'}`}
                      onClick={() => setMyTasksMode(true)}
                    >
                      Moje zadania
                    </button>
                  </li>}
                  <li className="nav-item">
                    <button
                      className={`nav-link ${!myTasksMode ? 'active' : 'text-muted'}`}
                      onClick={() => setMyTasksMode(false)}
                    >
                      Wszystkie zadania
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="d-flex overflow-auto mb-3">
                {(initialLock ? renderableCategories.filter(cat => cat.id === -1) : renderableCategories).map(cat => (
                  <button
                    key={cat.id}
                    className={`btn btn-outline-primary me-2 ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {cat.id === -1 && !initialLock && <i className="bi bi-check-circle-fill" style={{ color: 'black', marginRight: '8px' }}></i>}
                    {cat.name}
                  </button>
                ))}
              </div>
      </div>
    );
  };
  
  export default Sidebar;
  