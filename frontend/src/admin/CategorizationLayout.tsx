import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/modal';
import { UserInfo } from "../App";

const API_ROOT = process.env.REACT_APP_API_URL;

type CategorizationState = "OPEN"|"DRAFT"|"FINISHED";

type CategorizationTaskType = "BOOLEAN" | "LINEAR" | "LINEAR_REF" | "PARABOLIC_REF" | "REFONLY";

interface InitialTask {
  id: number;
  name: string;
  description: string | null;

  displayPriority: number;
};

interface CategorizationYear {
  id: number;
  name: string;
  state: CategorizationState;
  createdAt: string;

  lesnaLesneThreshold: number;
  lesnaPuszczanskieThreshold: number;
  puszczanskaLesnaThreshold: number;
  puszczanskaPuszczanskieThreshold: number;

  taskGroup: Array<{
    id: number;
    name: string;

    primaryTasks: Array<{
      id: number;
      name: string;
      description: string | null;
  
      primaryGroup: {
        id: number;
        name: string;
      };
      secondaryGroup: {
        id: number;
        name: string
      }|null;
      split: number;

      type: CategorizationTaskType;
      maxPoints: number;
      multiplier: number|null;

      obligatory: boolean;
    }>;

    lesnaThreshold: number;
    puszczanskaThreshold: number;

    displayPriority: number;
  }>;

  rankingExists: boolean;
};

const CategorizationLayout = ({userinfo, categorizationId} : {userinfo: UserInfo | null; categorizationId: number;}) => {
  useEffect(() => {
    if(userinfo !== null){
      updateCategorizationYear();
    }
  }, [categorizationId]);

  const [inputlock, setInputlock] = useState(false);
  const [nuclearmode, setNuclearmode] = useState(false);

  const [categorizationYear, setCategorizationYear] = useState<CategorizationYear>({name: "", state: "DRAFT", createdAt: "", id: -1, lesnaLesneThreshold: 0, lesnaPuszczanskieThreshold: 0, puszczanskaLesnaThreshold: 0, puszczanskaPuszczanskieThreshold: 0, rankingExists: false, taskGroup: []});
  const [initialTasks, setInitialTasks] = useState<Array<InitialTask>>([]);
  const [showFilledCategorizations, setShowFilledCategorizations] = useState(false);

  const [newGroup, setNewGroup] = useState<{name: string; displayPriority: number;}>({name: "", displayPriority: 100});
  const [newInitial, setNewInitial] = useState<{text: string; description: string;}|null>(null);

  const [lesnaThresholdModified, setLesnaThresholdsModified] = useState(false);
  const [puszczanskaThresholdModified, setPuszczanskaThresholdsModified] = useState(false);
  const [initialTaskModifiedMap, setInitialTaskModifiedMap] = useState(new Map<number,boolean>());

  const updateCategorizationYear = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/categorization/${categorizationId}`);
      setCategorizationYear({...res.data, initialTasks: undefined});
      setInitialTasks(res.data.initialTasks);
      setLesnaThresholdsModified(false);
      setPuszczanskaThresholdsModified(false);
    } catch (err: any) {
      setCategorizationYear({name: "", state: "DRAFT", createdAt: "", id: -1, lesnaLesneThreshold: 0, lesnaPuszczanskieThreshold: 0, puszczanskaLesnaThreshold: 0, puszczanskaPuszczanskieThreshold: 0, rankingExists: false, taskGroup: []});
      setInitialTasks([]);
    }
  };

  const modifyLesnaThresholds = async () => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/categorization/${categorizationId}`, {
        lesnaLesneThreshold: categorizationYear.lesnaLesneThreshold,
        lesnaPuszczanskieThreshold: categorizationYear.lesnaPuszczanskieThreshold,
      });
      setLesnaThresholdsModified(false);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const modifyPuszczanskaThresholds = async () => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/categorization/${categorizationId}`, {
        puszczanskaLesnaThreshold: categorizationYear.puszczanskaLesnaThreshold,
        puszczanskaPuszczanskieThreshold: categorizationYear.puszczanskaPuszczanskieThreshold,
      });
      setPuszczanskaThresholdsModified(false);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const createInitialTask = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/admin/categorization/initial`, {
        ...newInitial,
        text: undefined,
        name: newInitial?.text,
        categorizationYearId: categorizationId,
      });
      setNewInitial(null);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const modifyInitialTask = async (taskId: number) => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/categorization/initial/${taskId}`, initialTasks.filter(t => t.id === taskId)[0]);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const deleteInitialTask = async (taskId: number) => {
    try {
      const res = await axios.delete(`${API_ROOT}/admin/categorization/initial/${taskId}`);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

    return (
      <>
        {/* Top stats bar */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Nazwa</h5>
                <div style={{fontSize: '2.0rem'}}>
                  {categorizationYear.name}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Status</h5>
                {categorizationYear.state === "OPEN" ? 
                  <div style={{fontSize: '2.0rem'}} className="text-success">
                    TRWA
                  </div>
                : categorizationYear.state === "FINISHED" ?
                  <div style={{fontSize: '2.0rem'}} className="text-danger">
                    ZAMKNIĘTA
                  </div>
                :
                  <div style={{fontSize: '2.0rem'}} className="">
                    SZKIC
                  </div>
                }
              </div>
            </div>
          </div>
          {userinfo?.role === "ADMIN" && <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Dla odważnych</h5>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" checked={nuclearmode} onChange={(e) => {if(!e.target.checked) setNuclearmode(e.target.checked); else document.getElementById('openNuclearModeModal')?.click();}}/>
                  <label className="form-check-label text-danger">Tryb atomowy</label>
                </div>
              </div>
            </div>
          </div>}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Ranking</h5>
                {categorizationYear.rankingExists ? 'Przeliczony' : 'Dynamiczny'}<br/>
                <button className="btn btn-sm btn-danger" disabled={!nuclearmode}>Przelicz</button>
              </div>
            </div>
          </div>
        </div>

        {/* Show filled categorizations */}
        <div className="row row-cols-1 g-4 mt-2 mb-5">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center" onClick={(e) => setShowFilledCategorizations(!showFilledCategorizations)}><i className={`bi bi-caret-${showFilledCategorizations ? 'down' : 'right'}-fill`}></i>Lista wypełnionych arkuszy</h5>
              </div>
              {showFilledCategorizations && <div className="card-body p-0">
                <div className="list-group">
                  <div className="list-group-item">
                    <span className="me-3">Drużyna 1</span>
                    
                    <span className="badge bg-primary rounded-pill me-1">0</span>
                    <span className="badge bg-success rounded-pill me-1">1</span>
                    <span className="badge bg-danger rounded-pill me-1">2</span>

                    <img className={`ms-3 me-3 img-src-puszczanska`} style={{ width: '20px', height: '20px' }} />

                    <button className="btn btn-sm btn-dark ms-1">Zobacz arkusz</button>
                  </div>
                  <div className="list-group-item">
                    <span className="me-3">Drużyna 2</span>
                    
                    <span className="badge bg-primary rounded-pill me-1">0</span>
                    <span className="badge bg-success rounded-pill me-1">1</span>
                    <span className="badge bg-danger rounded-pill me-1">2</span>

                    <img className={`ms-3 me-3 img-src-polowa`} style={{ width: '20px', height: '20px' }} />

                    <button className="btn btn-sm btn-dark ms-1">Zobacz arkusz</button>
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>

        {/* Basic categorization row */}
        <div className="task-list">
          <div className="row row-cols-1 row-cols-xl-3 g-4">
            <div className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Kategoria <img className="img-src-polowa ms-2" style={{ width: '22px', height: '22px' }} /></h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex align-items-center">
                      Nie można ustawić wymagań dla tej kategorii, ponieważ otrzymuje ją każdy kto spełni wymagania podstawowe.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Kategoria <img className="img-src-lesna ms-2" style={{ width: '22px', height: '22px' }} /></h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-lesna ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={categorizationYear.taskGroup.length} value={categorizationYear.lesnaLesneThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, lesnaLesneThreshold: Number.parseInt(e.target.value)}); setLesnaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={categorizationYear.taskGroup.length} value={categorizationYear.lesnaPuszczanskieThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, lesnaPuszczanskieThreshold: Number.parseInt(e.target.value)}); setLesnaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                    </li>
                    {lesnaThresholdModified && <li className="list-group-item d-flex align-items-center text-center">
                      <button className="btn btn-dark" onClick={(e) => modifyLesnaThresholds()}>Zapisz powyższe wartości</button>
                    </li>}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Kategoria <img className="img-src-puszczanska ms-2" style={{ width: '22px', height: '22px' }} /></h5>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-lesna ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={categorizationYear.taskGroup.length} value={categorizationYear.puszczanskaLesnaThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, puszczanskaLesnaThreshold: Number.parseInt(e.target.value)}); setPuszczanskaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={categorizationYear.taskGroup.length} value={categorizationYear.puszczanskaPuszczanskieThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, puszczanskaPuszczanskieThreshold: Number.parseInt(e.target.value)}); setPuszczanskaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                    </li>
                    {puszczanskaThresholdModified && <li className="list-group-item d-flex align-items-center text-center">
                      <button className="btn btn-dark" onClick={(e) => modifyPuszczanskaThresholds()}>Zapisz powyższe wartości</button>
                    </li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups rows */}
        <div className="row row-cols-1 g-4 mt-2">
          <div key="initial" className="col">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center">Wymagania podstawowe</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group">
                  {initialTasks.map((initialTask) => {
                    return <div className="list-group-item">
                      <div className="d-flex mb-3">
                        <div className="w-100">
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Treść wymagania</span>
                            </div>
                            <input className="form-control" type="text" value={initialTask.name} onChange={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, true); setInitialTaskModifiedMap(m); setInitialTasks(initialTasks.map(t => t.id === initialTask.id ? { ...t, name: e.target.value } : t));}}/>
                          </div>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text h-100">Opis wymagania</span>
                            </div>
                            <textarea className="form-control" value={initialTask.description || ""} onChange={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, true); setInitialTaskModifiedMap(m); setInitialTasks(initialTasks.map(t => t.id === initialTask.id ? { ...t, description: e.target.value } : t));}}/>
                          </div>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Priorytet wyświetlania</span>
                            </div>
                            <input className="form-control" type="number" min="0" max="1000" value={initialTask.displayPriority} onChange={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, true); setInitialTaskModifiedMap(m); setInitialTasks(initialTasks.map(t => t.id === initialTask.id ? { ...t, displayPriority: Number.parseInt(e.target.value) } : t));}}/>
                          </div>
                        </div>
                        <button className="ms-1 btn btn-dark" onClick={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, false); setInitialTaskModifiedMap(m); modifyInitialTask(initialTask.id);}} disabled={!initialTaskModifiedMap.get(initialTask.id)}>Zapisz zmiany</button>
                        <button className="ms-1 btn btn-danger" onClick={(e) => deleteInitialTask(initialTask.id)}>Usuń</button>
                      </div>
                    </div>;
                  })}
                  <div className="list-group-item text-center">
                    {newInitial === null && <button className="btn btn-dark" onClick={(e) => setNewInitial({text: "", description: ""})}>Dodaj nowe wymaganie</button>}
                    {newInitial !== null && <div className="d-flex mb-3">
                      <div className="w-100">
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text">Treść wymagania</span>
                          </div>
                          <input className="form-control" type="text" value={newInitial.text} onChange={(e) => setNewInitial({...newInitial, text: e.target.value})}/>
                        </div>
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text h-100">Opis wymagania</span>
                          </div>
                          <textarea className="form-control" value={newInitial.description} onChange={(e) => setNewInitial({...newInitial, description: e.target.value})}/>
                        </div>
                      </div>
                      <button className="ms-1 btn btn-dark" onClick={(e) => {createInitialTask();}}>Dodaj</button>
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div key="nowa" className="col">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center">Utwórz nową grupę zadań</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Nazwa</span>
                      </div>
                      <input className="form-control" type="text" value={newGroup.name} onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Priorytet wyświetlania</span>
                      </div>
                      <input className="form-control" type="number" min="0" max="1000" value={newGroup.displayPriority} onChange={(e) => setNewGroup({...newGroup, displayPriority: e.target.value === "" ? 100 : parseInt(e.target.value)})}/>
                    </div>
                  </div>
                  <div className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                    <button className="btn btn-danger">Utwórz grupę zadań</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div key="id01somethingsomething" className="col">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center">Stan jednostki</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Nazwa</span>
                      </div>
                      <input className="form-control" type="text" value="Stan jednostki"/>
                    </div>
                    <p className="mt-2 mb-2">
                      Liczba punktów do zdobycia: <b>50</b>
                    </p>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Minimum punktów na symbol LEŚNY <img className="img-src-lesna ms-2" style={{ width: '20px', height: '20px' }} /></span>
                      </div>
                      <input className="form-control" type="number" min="0" max="6" value="2"/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Minimum punktów na symbol PUSZCZAŃSKI <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                      </div>
                      <input className="form-control" type="number" min="0" max="10" value="5"/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Priorytet wyświetlania</span>
                      </div>
                      <input className="form-control" type="number" min="0" max="1000" value="100"/>
                    </div>
                  </div>
                  <div className="list-group-item">
                    <h4 className="text-center fw-bold">Zadanie: Liczba osób w jednostce</h4>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Treść zadania</span>
                      </div>
                      <input className="form-control" type="text" value="Liczba osób w jednostce"/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text h-100">Opis zadania</span>
                      </div>
                      <textarea className="form-control" rows={3}/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Liczba punktów za zadanie</span>
                      </div>
                      <input className="form-control" type="number" min="1" max="10" value="5"/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Rodzaj zadania</span>
                      </div>
                      <select className="form-select">
                        <option value="BOOLEAN" selected>Tak/Nie</option>
                        <option value="LINEAR">Liniowe</option>
                        <option value="LINEAR_REF">Liniowe z odniesieniem</option>
                        <option value="LINEAR_REF">Paraboliczne z odniesieniem</option>
                        <option value="REFONLY">Niepunktowane (wartość odniesienia)</option>
                      </select>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Obowiązkowe</span>
                      </div>
                      <select className="form-select">
                        <option value="true">Tak</option>
                        <option value="false" selected>Nie</option>
                      </select>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Dziel punkty z kategorią</span>
                      </div>
                      <select className="form-select">
                        <option>Nie dziel punktów</option>
                        <option selected>Duchowe</option>
                      </select>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Podział punktów</span>
                      </div>
                      <div className="input-group-prepend">
                        <span className="input-group-text">Kategoria Stan jednostki:</span>
                      </div>
                      <input className="form-control" type="number" min="1" max="10" value="5"/>
                      <div className="input-group-prepend">
                        <span className="input-group-text">Kategoria Duchowe:</span>
                      </div>
                      <input className="form-control" type="number" min="1" max="10" value="5"/>
                    </div>
                  </div>
                  <div className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                    <button className="btn btn-dark">Dodaj nowe zadanie</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="nuclearModeModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">CZY NA PEWNO?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><i>Wolniej, wolniej, wstrzymaj konia...</i></p>
                <p><b>TRYB ATOMOWY</b> pozwoli Ci robić rzeczy, których nie powinieneś robić. Nie powinieneś usuwać zadań z trwającej kategoryzacji, nie powinieneś przeliczać rankingu w zamkniętej kategoryzacji, i paru innych rzeczy też nie powinieneś robić...</p>
                <p>Jeśli nie jesteś absolutnie pewny swoich działań, zawróć póki nic nie zepsułeś.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => setNuclearmode(true)}>POZWÓL MI POPEŁNIAĆ BŁĘDY</button>
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Wychodzę</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" id="openNuclearModeModal" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#nuclearModeModal"/>
      </>
    );
  };
  
  export default CategorizationLayout;
  