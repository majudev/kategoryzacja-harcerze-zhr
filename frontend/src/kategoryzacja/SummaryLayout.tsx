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

const SummaryLayout = ({categories, myTasksMode, toggleMyTask, updateTask, locked} : {categories: Array<Category>; myTasksMode: boolean; toggleMyTask: (taskId: number, state: boolean) => void; updateTask: (taskId: number, value: string) => void; locked: boolean}) => {
    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {categories.map((category) => {
          const filteredTasks = myTasksMode
            ? category.tasks.filter((task) => task.favourite)
            : category.tasks;

          return (
            <div key={category.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{category.name}</h5>
                  <small>
                    {filteredTasks.filter((t) => t.value).length}/{filteredTasks.length}
                  </small>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {filteredTasks.map((task) => (
                      <li key={task.id} className="list-group-item d-flex align-items-center">
                        {task.type === "BOOLEAN" ?
                        <input
                          type="checkbox"
                          className="form-check-input flex-shrink-0"
                          checked={task.value > 0}
                          style={{ padding: '5px', marginLeft: '11px', marginRight: '27px', marginTop: '0px', height: '1.25em', width: '1.25em' }}
                          onChange={(e) => updateTask(task.id, e.target.checked ? '1' : '0')}
                          disabled={locked}
                        />
                        :
                        <input
                          type="text"
                          className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                          value={task.value}
                          placeholder="..."
                          style={{ width: '42px' }}
                          onChange={(e) => updateTask(task.id, e.target.value)}
                          disabled={locked}
                        />
                        }
                        <span
                          className={`flex-grow-1 ${task.value ? 'text-muted text-decoration-line-through' : ''}`}
                        >
                          {task.name}
                        </span>
                        <i
                          className={`bi bi-star${task.favourite ? '-fill' : ''} text-warning fs-5`}
                          onClick={() => {if(!task.obligatory && !locked) toggleMyTask(task.id, !task.favourite)}}
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
  