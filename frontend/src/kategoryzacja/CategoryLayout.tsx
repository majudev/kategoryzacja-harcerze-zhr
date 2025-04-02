import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import Sidebar from "./Sidebar";
import StatsBar from "./StatsBar";
import Summary from "./SummaryLayout";
import { UserInfo, Category as CategoryType } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const CategoryLayout = ({userinfo, category: cat, myTasksMode} : {userinfo: UserInfo | null; category: CategoryType; myTasksMode: boolean;}) => {
    return (
      <>
        <h4 className="mb-3">{cat.title} Tasks</h4>
        <div className="list-group">
          {(myTasksMode ? cat.tasks.filter(t => t.starred) : cat.tasks).map(task => (
            <div
              key={task.id}
              className="list-group-item list-group-item-action d-flex align-items-center"
            >
              <input
                type="checkbox"
                className="form-check-input me-3 flex-shrink-0"
                checked={task.checked}
                /*onChange={() => toggleTask(task.id)}*/
              />
              <span className={`flex-grow-1 ${task.checked ? 'text-muted text-decoration-line-through' : ''}`}>
                {task.title}
              </span>
              <button 
                className="btn btn-link p-0 ms-2"
                /*onClick={() => toggleStar(task.id)}*/
              >
                <i className={`bi bi-star${task.starred ? '-fill' : ''} ${task.starred ? 'text-warning' : 'text-secondary'}`} />
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };
  
  export default CategoryLayout;
  