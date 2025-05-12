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

const CategoryLayout = ({categories, category: cat, myTasksMode, toggleMyTask, updateTask, locked} : {categories: Array<CategoryType>; category: CategoryType; myTasksMode: boolean; toggleMyTask: (taskId: number, state: boolean) => void; updateTask: (taskId: number, value: string) => void; locked: boolean}) => {
  const collectedSplitPoints = cat.tasks.reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.points : t.secondaryGroupId === cat.id ? t.secondaryPoints as number : t.primaryPoints as number), 0);
  const maxSplitPoints = cat.tasks.reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.maxPoints : t.secondaryGroupId === cat.id ? t.secondaryMaxPoints as number : t.primaryMaxPoints as number), 0);
  const maxFilteredSplitPoints = cat.tasks.filter(t => t.favourite).reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.maxPoints : t.secondaryGroupId === cat.id ? t.secondaryMaxPoints as number : t.primaryMaxPoints as number), 0);

  const [showTaskMap, setShowTaskMap] = useState(new Map<number, boolean>());

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
                  disabled={locked}
                />
                :
                <input
                  type="text"
                  className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                  value={task.value === 0 ? "" : task.value}
                  placeholder="0"
                  style={{ width: '42px' }}
                  onChange={(e) => updateTask(task.id, e.target.value)}
                  disabled={locked}
                />
                }
                <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                  {task.name} - {task.type === "REFONLY" ? <b>niepunktowane</b> : <b>{task.secondaryGroupId === null ? task.points.toFixed(1) : task.secondaryGroupId === cat.id ? task.secondaryPoints?.toFixed(1) : task.primaryPoints?.toFixed(1)}/{task.secondaryGroupId === null ? task.maxPoints.toFixed(1) : task.secondaryGroupId === cat.id ? task.secondaryMaxPoints?.toFixed(1) : task.primaryMaxPoints?.toFixed(1)} pkt</b>}
                  {task.type !== "REFONLY" && task.secondaryGroupId !== null && <><br/>
                    <small style={{ fontSize: "0.7em", fontWeight: "bold" }}>Zadanie dzielone: max {task.primaryMaxPoints} pkt do {task.primaryGroupName}, osobne max {task.secondaryMaxPoints} pkt do {task.secondaryGroupName}</small>
                  </>}
                  {(task.type !== "BOOLEAN" || task.description) && <><br/><small onClick={(e) => {const newMap = new Map(showTaskMap); newMap.set(task.id, !(showTaskMap.get(task.id) || false)); setShowTaskMap(newMap)}}><i className={`bi bi-caret-${showTaskMap.get(task.id) ? 'down' : 'right'}-fill`} />{showTaskMap.get(task.id) ? 'Zwiń' : 'Rozwiń'} opis</small></>}
                  {showTaskMap.get(task.id) && <>
                    {task.type !== "BOOLEAN" && <><br/><small style={{ fontWeight: "bold" }}>Rodzaj zadania: {task.type === "LINEAR" ? 'liniowe' : task.type === "LINEAR_REF" ? 'liniowe z odniesieniem' : task.type === "PARABOLIC_REF" ? 'paraboliczne z odniesieniem' : task.type === "REFONLY" ? 'tylko wartość odniesienia' : 'inne'}</small></>}
                    {task.type === "LINEAR" && <><br/><small style={{ fontWeight: "bold" }}>Mnożnik: {task.multiplier?.toFixed(1)}x</small></>}
                    {(task.type === "LINEAR_REF" || task.type === "PARABOLIC_REF") && <><br/><small style={{ fontWeight: "bold" }}>Odniesienie do punktów z zadania: {categories.flatMap(c => c.tasks).filter(t => t.id === task.refValId)[0].name} ({categories.filter(c => c.tasks.filter(t => t.id === task.refValId).length > 0)[0].name})</small></>}
                    {task.description && <><br/><small>{task.description}</small></>}
                  </>}
                </span>
                <button 
                  className="btn p-0 ms-2 d-inline-flex align-items-center"
                  onClick={() => {if(!task.obligatory && !locked) toggleMyTask(task.id, !task.favourite)}}
                >
                  {task.obligatory && <small className="me-1" style={{ fontSize: "0.7em", fontWeight: "bold" }}>obowiązkowe</small>}
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
              <p>Oznaczyłeś do zrobienia <b>{cat.tasks.filter(t => t.favourite).length}</b> zadań.</p>
              <p>Gdybyś wykonał je wszystkie, mógłbyś mieć {maxFilteredSplitPoints} punktów i zdobyć symbol <img className={maxFilteredSplitPoints >= cat.puszczanskaThreshold ? "img-src-puszczanska" : maxFilteredSplitPoints >= cat.lesnaThreshold ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px' }} />.</p>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Punkty</th>
                    <th scope="col" className="text-center">Symbol</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">0-{cat.lesnaThreshold-0.01}</th>
                    <td className="text-center"><img className="img-src-polowa" style={{ width: '40px', height: '40px' }} /></td>
                  </tr>
                  <tr>
                    <th scope="row">{cat.lesnaThreshold}-{cat.puszczanskaThreshold-0.01}</th>
                    <td className="text-center"><img className="img-src-lesna" style={{ width: '40px', height: '40px' }} /></td>
                  </tr>
                  <tr>
                    <th scope="row">{cat.puszczanskaThreshold}-{maxSplitPoints}</th>
                    <td className="text-center"><img className="img-src-puszczanska" style={{ width: '40px', height: '40px' }} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CategoryLayout;
  