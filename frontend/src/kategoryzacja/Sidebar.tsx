import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { UserInfo, Category, Task } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const Sidebar = ({type, userinfo, renderableCategories, myTasksMode, setMyTasksMode, activeCategory, setActiveCategory} : {type: "desktop"|"mobile"; userinfo: UserInfo | null; renderableCategories: Array<Category>; myTasksMode: boolean; setMyTasksMode: React.Dispatch<React.SetStateAction<boolean>>; activeCategory: number; setActiveCategory: React.Dispatch<React.SetStateAction<number>>}) => {
    // Desktop sidebar
    if(type === "desktop") return (
      <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
        <div className="p-3 border-bottom">
          <h4 className="mb-3">Arkusz śródroczny</h4>
          <ul className="nav nav-underline">
            <li className="nav-item">
              <button
                className={`nav-link ${myTasksMode ? 'active' : 'text-muted'}`}
                onClick={() => setMyTasksMode(true)}
              >
                Moje zadania
              </button>
            </li>
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
          {renderableCategories.map(cat => {
            const allTasksLength = cat.tasks.length;
            const myTasksLength = cat.tasks.filter(t => t.favourite).length;
            const tasksLength = myTasksMode ? myTasksLength : allTasksLength;
            return (
            <div 
              key={cat.id}
              className={`p-3 border-bottom ${activeCategory === cat.id ? 'bg-white' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{cat.name}</h6>
                <span className="badge bg-primary rounded-pill">
                  {cat.tasks.filter(t => t.checked).length}/{tasksLength}
                </span>
              </div>
              <div className="progress mt-2" style={{height: '3px'}}>
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${tasksLength > 0 ? ((cat.tasks.filter(t => t.checked).length / cat.tasks.length) * 100) : 0}%`}}
                />
              </div>
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
                  <li className="nav-item">
                    <button
                      className={`nav-link ${myTasksMode ? 'active' : 'text-muted'}`}
                      onClick={() => setMyTasksMode(true)}
                    >
                      Moje zadania
                    </button>
                  </li>
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
                {renderableCategories.map(cat => (
                  <button
                    key={cat.id}
                    className={`btn btn-outline-primary me-2 ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
      </div>
    );
  };
  
  export default Sidebar;
  