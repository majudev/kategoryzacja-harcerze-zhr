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

const CategoryLayout = ({userinfo, category: cat, myTasksMode, toggleMyTask, updateTask} : {userinfo: UserInfo | null; category: CategoryType; myTasksMode: boolean; toggleMyTask: (taskId: number, state: boolean) => void; updateTask: (taskId: number, value: string) => void}) => {
    return (
      <div className="container-fluid row m-0 p-0">
        <div className="col-12 col-md-8 p-0">
          <h4 className="mb-3">{cat.name}</h4>
          <div className="list-group">
            {(myTasksMode ? cat.tasks.filter(t => t.favourite) : cat.tasks).map(task => (
              <div
                key={task.id}
                className="list-group-item list-group-item-action d-flex align-items-center"
              >
                {task.type === "BOOLEAN" ?
                <input
                  type="checkbox"
                  className="form-check-input flex-shrink-0"
                  checked={task.value > 0}
                  style={{ padding: '5px', marginLeft: '11px', marginRight: '27px', marginTop: '0px', height: '1.25em', width: '1.25em' }}
                  onChange={(e) => updateTask(task.id, e.target.checked ? '1' : '0')}
                />
                :
                <input
                  type="text"
                  className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                  value={task.value}
                  placeholder="..."
                  style={{ width: '42px' }}
                  onChange={(e) => updateTask(task.id, e.target.value)}
                />
                }
                <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                  {task.name} - <b>{task.secondaryGroupId === null ? task.points : task.secondaryGroupId === cat.id ? task.secondaryPoints : task.primaryPoints}/{task.secondaryGroupId === null ? task.maxPoints : task.secondaryGroupId === cat.id ? task.secondaryMaxPoints : task.primaryMaxPoints} pkt</b>
                  {task.secondaryGroupId !== null && <><br/>
                  <small style={{ fontSize: "0.7em", fontWeight: "bold" }}>Zadanie dzielone: max {task.primaryMaxPoints} pkt do {task.primaryGroupName}, osobne max {task.secondaryMaxPoints} pkt do {task.secondaryGroupName}</small>
                  </>}
                </span>
                <button 
                  className="btn btn-link p-0 ms-2"
                  onClick={() => toggleMyTask(task.id, !task.favourite)}
                >
                  <i className={`bi bi-star${task.favourite ? '-fill' : ''} ${task.favourite ? 'text-warning' : 'text-secondary'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-md-4 ps-4 pe-0">
          <div className="card h-100 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-center">Twój progress</h5>
            </div>
            <div className="card-body">
              <p>Zdobyłeś na razie <b>10</b> na <b>35 możliwych punktów</b>.</p>
              <p>Twój aktualny token to: <b>token leśny</b></p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CategoryLayout;
  