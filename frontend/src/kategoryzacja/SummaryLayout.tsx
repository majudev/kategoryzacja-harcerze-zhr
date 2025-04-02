import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import Sidebar from "./Sidebar";
import StatsBar from "./StatsBar";
import { Category, UserInfo } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const SummaryLayout = ({userinfo, categories, myTasksMode} : {userinfo: UserInfo | null; categories: Array<Category>; myTasksMode: boolean}) => {
    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {categories.map((category) => {
          const filteredTasks = myTasksMode
            ? category.tasks.filter((task) => task.starred)
            : category.tasks;

          return (
            <div key={category.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{category.title}</h5>
                  <small>
                    {filteredTasks.filter((t) => t.checked).length}/{filteredTasks.length}
                  </small>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {filteredTasks.map((task) => (
                      <li key={task.id} className="list-group-item d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-3"
                          checked={task.checked}
                          /*onChange={() => toggleTask(task.id)}*/
                        />
                        <span
                          className={`flex-grow-1 ${task.checked ? 'text-muted text-decoration-line-through' : ''}`}
                        >
                          {task.title}
                        </span>
                        <i
                          className={`bi bi-star${task.starred ? '-fill' : ''} text-warning fs-5`}
                          /*onClick={() => toggleStar(task.id)}*/
                          style={{ cursor: 'pointer' }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default SummaryLayout;
  