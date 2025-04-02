import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { Category, UserInfo } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const StatsBar = ({userinfo, categories, myTasksMode} : {userinfo: UserInfo | null; categories: Array<Category>; myTasksMode: boolean}) => {
    const allTasks = categories.flatMap(cat => cat.tasks);
    const completedTasks = allTasks.filter(t => t.checked).length;
    const starredTasks = allTasks.filter(t => t.favourite);

    return (
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Moje zadania</h5>
              <div className="d-flex align-items-center">
                <div className="display-4 fw-bold">{starredTasks.length}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Wykonane</h5>
              <div className="d-flex align-items-center">
                <div className="display-4 fw-bold">{completedTasks}</div>
                <span className="ms-2 text-success">
                  ({Math.round((completedTasks / allTasks.length) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Kategoria</h5>
              <div className="display-4 category-img-lesna" style={{color: "rgba(0, 0, 0, 0)"}}>
                c
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Progress</h5>
              <div className="progress" style={{height: '8px'}}>
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${(completedTasks / allTasks.length) * 100}%`}}
                />
              </div>
              <span className="text-end text-success">
                {Math.round((completedTasks / allTasks.length) * 100)}%
              </span>
              <p className="fst-italic mt-2 mb-0">Do boju!</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default StatsBar;
  