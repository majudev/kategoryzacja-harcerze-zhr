import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/modal';
import { UserInfo } from "../App";
import { floatToString } from "../common/textformatter";

const API_ROOT = process.env.REACT_APP_API_URL;

type CategorizationState = "OPEN"|"DRAFT"|"FINISHED";

type CategorizationTaskType = "BOOLEAN" | "LINEAR" | "LINEAR_REF" | "PARABOLIC_REF" | "REFONLY";

interface InitialTask {
  id: number;
  name: string;
  description: string | null;

  displayPriority: number;
};

interface CategorizationTask {
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

  refValId: number|null;

  obligatory: boolean;
}

interface CategorizationTaskGroup {
  id: number;
  name: string;

  primaryTasks: Array<CategorizationTask>;

  lesnaThreshold: number;
  puszczanskaThreshold: number;

  displayPriority: number;
}

interface CategorizationYear {
  id: number;
  name: string;
  state: CategorizationState;
  createdAt: string;

  lesnaLesneThreshold: number;
  lesnaPuszczanskieThreshold: number;
  puszczanskaLesnaThreshold: number;
  puszczanskaPuszczanskieThreshold: number;

  ranking: boolean;
};

interface FilledCategorizationEntry {
  category: 'POLOWA' | 'LESNA' | 'PUSZCZANSKA';
  nextCategory: 'POLOWA' | 'LESNA' | 'PUSZCZANSKA';
  tokens: {
    polowa: number;
    lesna: number;
    puszczanska: number;
  };
  missingTokens: {
    lesna: number;
    puszczanska: number;
  };
  id: number;
  name: string;
  district: {
    id: number;
    name: string;
  };
}

const CategorizationLayout = ({userinfo, categorizationId, reloadCategorizationsHook} : {userinfo: UserInfo | null; categorizationId: number; reloadCategorizationsHook : React.Dispatch<React.SetStateAction<boolean>>}) => {
  useEffect(() => {
    if(userinfo !== null){
      updateCategorizationYear();
      updateFilledCategorizations();
    }

    // Reset the state
    setNuclearmode(false);
    setShowFilledCategorizations(false);
    setShowInitialTasks(false);
    setShowTaskGroupMap(new Map<number,boolean>());
    setShowTaskMap(new Map<number,boolean>());

    setNewInitial(null);
    setNewGroup({name: "", displayPriority: 100});
    setNewTask({id: -1, description: "", maxPoints: 0, multiplier: 1, name: "", obligatory: false, primaryGroup: {id: -1, name: ""}, secondaryGroup: null, refValId: null, split: 1, type: "BOOLEAN"});
  }, [categorizationId]);

  const [nuclearmode, setNuclearmode] = useState(false);

  const [categorizationYear, setCategorizationYear] = useState<CategorizationYear>({name: "", state: "DRAFT", createdAt: "", id: -1, lesnaLesneThreshold: 0, lesnaPuszczanskieThreshold: 0, puszczanskaLesnaThreshold: 0, puszczanskaPuszczanskieThreshold: 0, ranking: false});
  const [initialTasks, setInitialTasks] = useState<Array<InitialTask>>([]);
  const [taskGroups, setTaskGroups] = useState<Array<CategorizationTaskGroup>>([]);

  const [filledCategorizations, setFilledCategorizations] = useState<Array<FilledCategorizationEntry>>([]);

  const [showFilledCategorizations, setShowFilledCategorizations] = useState(false);
  const [showInitialTasks, setShowInitialTasks] = useState(false);
  const [showTaskGroupMap, setShowTaskGroupMap] = useState(new Map<number,boolean>());
  const [showTaskMap, setShowTaskMap] = useState(new Map<number,boolean>());

  const [newGroup, setNewGroup] = useState<{name: string; displayPriority: number;}>({name: "", displayPriority: 100});
  const [newInitial, setNewInitial] = useState<{text: string; description: string;}|null>(null);
  const [newTask, setNewTask] = useState<CategorizationTask>({id: -1, description: "", maxPoints: 0, multiplier: null, name: "", obligatory: false, primaryGroup: {id: -1, name: ""}, secondaryGroup: null, refValId: null, split: 1, type: "BOOLEAN"});

  const [lesnaThresholdModified, setLesnaThresholdsModified] = useState(false);
  const [puszczanskaThresholdModified, setPuszczanskaThresholdsModified] = useState(false);
  const [initialTaskModifiedMap, setInitialTaskModifiedMap] = useState(new Map<number,boolean>());
  const [taskGroupModifiedMap, setTaskGroupModifiedMap] = useState(new Map<number,boolean>());
  const [taskModifiedMap, setTaskModifiedMap] = useState(new Map<number,boolean>());
  
  const [taskRefFilterMap, setTaskRefFilterMap] = useState(new Map<number,string>());
  const [newTaskRefFilter, setNewTaskRefFilter] = useState<string|undefined>();

  const [deleteModalAction, setDeleteModalAction] = useState<"DELETE_CATYEAR"|"DELETE_CATEGORY"|"DELETE_TASK"|"DELETE_INITIALTASK">("DELETE_CATYEAR");
  const [deleteModalArgument, setDeleteModalArgument] = useState(0);

  const updateCategorizationYear = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/categorization/${categorizationId}`);
      setCategorizationYear({...res.data, initialTasks: undefined, taskGroup: undefined});
      setInitialTasks(res.data.initialTasks);
      setTaskGroups(res.data.taskGroup);

      setLesnaThresholdsModified(false);
      setPuszczanskaThresholdsModified(false);
      setInitialTaskModifiedMap(new Map<number,boolean>());
      setTaskGroupModifiedMap(new Map<number,boolean>());
      setTaskModifiedMap(new Map<number,boolean>());

      setTaskRefFilterMap(new Map<number,string>());
      setNewTaskRefFilter(undefined);
    } catch (err: any) {
      setCategorizationYear({name: "", state: "DRAFT", createdAt: "", id: -1, lesnaLesneThreshold: 0, lesnaPuszczanskieThreshold: 0, puszczanskaLesnaThreshold: 0, puszczanskaPuszczanskieThreshold: 0, ranking: false});
      setInitialTasks([]);
      setTaskGroups([]);
    }
  };

  const updateFilledCategorizations = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/admin/categorization/list/${categorizationId}`);
      setFilledCategorizations(res.data);
    } catch (err: any) {
      setFilledCategorizations([]);
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

  const createTaskGroup = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/admin/categorization/tasks/group`, {
        ...newGroup,

        lesnaThreshold: 1,
        puszczanskaThreshold: 1,
        categorizationYearId: categorizationId,
      });
      setNewGroup({name: "", displayPriority: 100});
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const modifyTaskGroup = async (id: number) => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/categorization/tasks/group/${id}`, taskGroups.filter(tg => tg.id === id)[0]);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const deleteTaskGroup = async (id: number) => {
    try {
      const res = await axios.delete(`${API_ROOT}/admin/categorization/tasks/group/${id}`);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const createTask = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/admin/categorization/tasks`, {
        ...newTask,

        primaryGroupId: newTask.primaryGroup.id,
        secondaryGroupId: newTask.secondaryGroup !== null ? newTask.secondaryGroup.id : null,
      });
      setNewTask({id: -1, description: "", maxPoints: 0, multiplier: 1, name: "", obligatory: false, primaryGroup: {id: -1, name: ""}, secondaryGroup: null, refValId: null, split: 1, type: "BOOLEAN"});
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const modifyTask = async (id: number) => {
    try {
      const task = taskGroups.flatMap((tg) => tg.primaryTasks).filter(t => t.id === id)[0];
      const res = await axios.patch(`${API_ROOT}/admin/categorization/tasks/${id}`, {
        ...task,

        primaryGroupId: task.primaryGroup.id,
        secondaryGroupId: task.secondaryGroup !== null ? task.secondaryGroup.id : null,
      });
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await axios.delete(`${API_ROOT}/admin/categorization/tasks/${id}`);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const rebuildRanking = async () => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/categorization/state/ranking/rebuild/${categorizationId}`);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const deleteRanking = async () => {
    try {
      const res = await axios.patch(`${API_ROOT}/admin/categorization/state/ranking/makedynamic/${categorizationId}`);
      updateCategorizationYear();
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const changeState = async (state: "OPEN" | "DRAFT" | "FINISHED") => {
    try {
      const action = state === "DRAFT" ? `draftify/${categorizationId}` :
                     state === "OPEN" ? `activate/${categorizationId}` :
                     "close";
      const res = await axios.patch(`${API_ROOT}/admin/categorization/state/${action}`);
      updateCategorizationYear();
      reloadCategorizationsHook(true); // Changed state of categorizations - reload needed
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

  const deleteCategorizationYear = async () => {
    try {
      const res = await axios.delete(`${API_ROOT}/admin/categorization/${categorizationId}`);
      reloadCategorizationsHook(true); // Changed state of categorizations - reload needed
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
                {userinfo?.role !== "DISTRICT_COORDINATOR" && <>
                  {categorizationYear.state === "OPEN" ? <>
                    <button className="btn btn-sm btn-dark" onClick={(e) => changeState("FINISHED")}>Zamknij</button>
                  </>:categorizationYear.state === "FINISHED" ? <>
                    <button className="btn btn-sm btn-danger" onClick={(e) => changeState("OPEN")} disabled={!nuclearmode}>Otwórz ponownie</button>
                    <button className="btn btn-sm btn-dark mt-1" onClick={(e) => changeState("DRAFT")}>Zamień na szkic</button>
                  </>:<>
                    <button className="btn btn-sm btn-dark me-1" onClick={(e) => changeState("OPEN")}>Otwórz</button>
                    <button key="deleteCategorizationButton" className="btn btn-sm btn-danger me-1" onClick={(e) => {setDeleteModalAction("DELETE_CATYEAR"); document.getElementById('openDeleteCallbackModal')?.click()}}>Usuń</button>
                  </>}
                </>}
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Dla odważnych</h5>
                {userinfo?.role !== "DISTRICT_COORDINATOR" && <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" checked={nuclearmode} onChange={(e) => {if(!e.target.checked) setNuclearmode(e.target.checked); else document.getElementById('openNuclearModeModal')?.click();}}/>
                  <label className="form-check-label text-danger">Tryb atomowy</label>
                </div>}
                <button className="btn btn-sm btn-dark" onClick={(e) => {setShowInitialTasks(true); taskGroups.forEach((v, i, a) => {showTaskGroupMap.set(v.id, true); v.primaryTasks.forEach((t) => showTaskMap.set(t.id, true))})}}>Rozwiń wszystko</button>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Ranking</h5>
                {categorizationYear.ranking ? 'Przeliczony' : `Dynamiczny ${categorizationYear.state === "FINISHED" ? "(!!!)" : ''}`}
                {userinfo?.role !== "DISTRICT_COORDINATOR" && <>
                  <br/>
                  <button className={`btn btn-sm btn-danger`} onClick={(e) => document.getElementById('openRebuildRankingModal')?.click()} disabled={categorizationYear.ranking && !nuclearmode}>{categorizationYear.ranking ? 'Przelicz ponownie' : 'Przelicz'}</button>
                  {categorizationYear.ranking && <button className="btn btn-sm btn-danger mt-1" onClick={(e) => document.getElementById('openDeleteRankingModal')?.click()} disabled={!nuclearmode}>Usuń ranking (włącz dynamiczny)</button>}
                </>}
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
                  {filledCategorizations.flatMap((entry) => entry.district.name).filter((value, index, array) => array.indexOf(value) === index).map((districtName) => {
                    return <>
                      <div className="list-group-item text-center" style={{backgroundColor: 'var(--bs-card-cap-bg)'}}>
                        <h5 className="mb-0">{districtName}</h5>
                      </div>
                      {filledCategorizations.filter((entry) => entry.district.name === districtName).map((entry) => {
                        return <div className="list-group-item">
                          <span className="me-3">{entry.name}</span>
                          
                          <span className="badge bg-primary rounded-pill me-1">{entry.tokens.polowa}</span>
                          <span className="badge bg-success rounded-pill me-1">{entry.tokens.lesna}</span>
                          <span className="badge bg-danger rounded-pill me-1">{entry.tokens.puszczanska}</span>

                          <img className={`ms-3 me-3 img-src-${entry.category.toLowerCase()}`} style={{ width: '20px', height: '20px' }} />

                          <Link className="btn btn-sm btn-dark ms-1" to={"/admin/kategoryzacja/" + entry.id}>Zobacz arkusz</Link>
                        </div>
                      })}
                    </>
                  })}
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
                        <input className="form-control" type="number" min="0" max={taskGroups.length} value={categorizationYear.lesnaLesneThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, lesnaLesneThreshold: Number.parseInt(e.target.value)}); setLesnaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={taskGroups.length} value={categorizationYear.lesnaPuszczanskieThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, lesnaPuszczanskieThreshold: Number.parseInt(e.target.value)}); setLesnaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
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
                        <input className="form-control" type="number" min="0" max={taskGroups.length} value={categorizationYear.puszczanskaLesnaThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, puszczanskaLesnaThreshold: Number.parseInt(e.target.value)}); setPuszczanskaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={taskGroups.length} value={categorizationYear.puszczanskaPuszczanskieThreshold} onChange={(e) => {setCategorizationYear({...categorizationYear, puszczanskaPuszczanskieThreshold: Number.parseInt(e.target.value)}); setPuszczanskaThresholdsModified(true);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
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
                <h5 className="mb-0 text-center" onClick={(e) => setShowInitialTasks(!showInitialTasks)}><i className={`bi bi-caret-${showInitialTasks ? 'down' : 'right'}-fill`}></i>Wymagania podstawowe</h5>
              </div>
              {showInitialTasks && <div className="card-body p-0">
                <div className="list-group">
                  {initialTasks.map((initialTask) => {
                    return <div key={initialTask.id} className="list-group-item">
                      <div className="d-flex mb-3">
                        <div className="w-100">
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Treść wymagania</span>
                            </div>
                            <input className="form-control" type="text" value={initialTask.name} onChange={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, true); setInitialTaskModifiedMap(m); setInitialTasks(initialTasks.map(t => t.id === initialTask.id ? { ...t, name: e.target.value } : t));}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                          </div>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text h-100">Opis wymagania</span>
                            </div>
                            <textarea className="form-control" value={initialTask.description || ""} onChange={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, true); setInitialTaskModifiedMap(m); setInitialTasks(initialTasks.map(t => t.id === initialTask.id ? { ...t, description: e.target.value } : t));}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                          </div>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Priorytet wyświetlania</span>
                            </div>
                            <input className="form-control" type="number" min="0" max="1000" value={initialTask.displayPriority} onChange={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, true); setInitialTaskModifiedMap(m); setInitialTasks(initialTasks.map(t => t.id === initialTask.id ? { ...t, displayPriority: Number.parseInt(e.target.value) } : t));}} disabled={userinfo?.role === "DISTRICT_COORDINATOR"} />
                          </div>
                        </div>
                        <button className="ms-1 btn btn-dark" onClick={(e) => {let m = new Map(initialTaskModifiedMap); m.set(initialTask.id, false); setInitialTaskModifiedMap(m); modifyInitialTask(initialTask.id);}} disabled={!initialTaskModifiedMap.get(initialTask.id)}>Zapisz zmiany</button>
                        <button className="ms-1 btn btn-danger" onClick={(e) => {setDeleteModalAction("DELETE_INITIALTASK"); setDeleteModalArgument(initialTask.id); document.getElementById('openDeleteCallbackModal')?.click()}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state === "FINISHED" && !nuclearmode)}>Usuń</button>
                      </div>
                    </div>;
                  })}
                  <div className="list-group-item text-center">
                    {newInitial === null && <button className="btn btn-dark" onClick={(e) => setNewInitial({text: "", description: ""})} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)}>Dodaj nowe wymaganie</button>}
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
              </div>}
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
                    <button className="btn btn-dark" onClick={(e) => createTaskGroup()}>Utwórz grupę zadań</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {taskGroups.map(((taskGroup) => {
            const allTasks = taskGroups.flatMap((tg) => tg.primaryTasks);
            const primaries = allTasks.filter((t) => t.primaryGroup.id === taskGroup.id);
            const primaryPoints = primaries.reduce((prev, t) => {
              if(t.type === "REFONLY") return prev;
              if(t.secondaryGroup === null) return prev + t.maxPoints;
              return prev + t.maxPoints * t.split;
            }, 0);
            const secondaries = allTasks.filter((t) => (t.secondaryGroup !== null && t.secondaryGroup.id === taskGroup.id));
            const secondaryPoints = secondaries.reduce((prev, t) => {
              if(t.type === "REFONLY") return prev;
              return prev + t.maxPoints * (1-t.split);
            }, 0);
            const maxPointsInGroup = primaryPoints + secondaryPoints;

            return <div key={taskGroup.id} className="col">
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-center" onClick={(e) => {let m = new Map(showTaskGroupMap); m.set(taskGroup.id, !m.get(taskGroup.id)); setShowTaskGroupMap(m);}}><i className={`bi bi-caret-${showTaskGroupMap.get(taskGroup.id) ? 'down' : 'right'}-fill`}></i>{taskGroup.name}</h5>
                </div>
                {showTaskGroupMap.get(taskGroup.id) && <div className="card-body p-0">
                  <div className="list-group">
                    <div className="list-group-item">
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Nazwa</span>
                        </div>
                        <input className="form-control" type="text" value={taskGroup.name} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, name: e.target.value}})); let m = new Map(taskGroupModifiedMap); m.set(taskGroup.id, true); setTaskGroupModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR"} />
                      </div>
                      <p className="mt-2 mb-2">
                        Liczba punktów do zdobycia: <b>{maxPointsInGroup}</b>
                      </p>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum punktów na symbol LEŚNY <img className="img-src-lesna ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={maxPointsInGroup} value={taskGroup.lesnaThreshold} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, lesnaThreshold: Number.parseInt(e.target.value)}})); let m = new Map(taskGroupModifiedMap); m.set(taskGroup.id, true); setTaskGroupModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum punktów na symbol PUSZCZAŃSKI <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max={maxPointsInGroup} value={taskGroup.puszczanskaThreshold} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, puszczanskaThreshold: Number.parseInt(e.target.value)}})); let m = new Map(taskGroupModifiedMap); m.set(taskGroup.id, true); setTaskGroupModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                      </div>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Priorytet wyświetlania</span>
                        </div>
                        <input className="form-control" type="number" min="0" max="1000" value={taskGroup.displayPriority} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, displayPriority: Number.parseInt(e.target.value)}})); let m = new Map(taskGroupModifiedMap); m.set(taskGroup.id, true); setTaskGroupModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR"} />
                      </div>
                      <div className="d-flex flex-column mb-1">
                        {taskGroupModifiedMap.get(taskGroup.id) && <button className="btn btn-dark ms-auto me-auto" onClick={(e) => modifyTaskGroup(taskGroup.id)}>Zapisz zmiany</button>}
                        <button className="btn btn-danger ms-auto me-auto" onClick={(e) => {setDeleteModalAction("DELETE_CATEGORY"); setDeleteModalArgument(taskGroup.id); document.getElementById('openDeleteCallbackModal')?.click()}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)}>Usuń kategorię zadań "{taskGroup.name}"</button>
                      </div>
                    </div>
                    {taskGroup.primaryTasks.map((task) => {
                      return <div key={task.id} className="list-group-item">
                        <h4 className="text-center fw-bold" onClick={(e) => {let m = new Map(showTaskMap); m.set(task.id, !m.get(task.id)); setShowTaskMap(m);}}><i className={`bi bi-caret-${showTaskMap.get(task.id) ? 'down' : 'right'}-fill`}></i>Zadanie: {task.name}</h4>
                        {showTaskMap.get(task.id) && <>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Treść zadania</span>
                            </div>
                            <input className="form-control" type="text" value={task.name} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, name: (t.id !== task.id) ? t.name : e.target.value}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                          </div>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text h-100">Opis zadania</span>
                            </div>
                            <textarea className="form-control" rows={3} value={task.description || ""} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, description: (t.id !== task.id) ? t.description : e.target.value}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                          </div>
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Rodzaj zadania</span>
                            </div>
                            <select className="form-select" value={task.type} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, type: (t.id !== task.id) ? t.type : e.target.value as CategorizationTaskType, obligatory: e.target.value === "REFONLY" ? true : task.obligatory}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} >
                              <option value="BOOLEAN">Tak/Nie</option>
                              <option value="LINEAR">Liniowe</option>
                              <option value="LINEAR_REF">Liniowe z odniesieniem</option>
                              <option value="PARABOLIC_REF">Paraboliczne z odniesieniem</option>
                              <option value="REFONLY">Niepunktowane (wartość odniesienia)</option>
                            </select>
                          </div>
                          {task.type !== "REFONLY" && <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Maksymalna liczba punktów za zadanie</span>
                            </div>
                            <input className="form-control" type="number" min="0" value={task.maxPoints} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, maxPoints: (t.id !== task.id) ? t.maxPoints : Number.parseInt(e.target.value)}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                          </div>}
                          {task.type === "LINEAR" && <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Mnożnik</span>
                            </div>
                            <input className="form-control" type="number" min="0" step="0.5" value={task.multiplier || "0"} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, multiplier: (t.id !== task.id) ? t.multiplier : Number.parseFloat(e.target.value)}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                          </div>}
                          {(task.type === "LINEAR_REF" || task.type === "PARABOLIC_REF") && <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Wartość odniesienia</span>
                            </div>
                            <select className="form-select" value={task.refValId || "NONE"} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, refValId: (t.id !== task.id) ? t.refValId : Number.parseInt(e.target.value)}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} >
                              <option value="NONE" disabled>Wybierz...</option>
                              {taskGroups.flatMap((tg) => tg.primaryTasks).filter((t) => {const current = taskRefFilterMap.get(task.id); if(current === undefined) return true; return t.name.includes(current) || t.id === task.refValId}).map((t) => {
                                return <option value={t.id}>{t.name}</option>
                              })}
                            </select>
                            <div className="input-group-append">
                              <input className="form-control" type="text" placeholder="Wyszukaj po nazwie..." value={taskRefFilterMap.get(task.id)} onChange={(e) => {let m = new Map(taskRefFilterMap); if(e.target.value !== "") m.set(task.id, e.target.value); else m.delete(task.id); setTaskRefFilterMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} />
                            </div>
                          </div>}
                          <div className="input-group mb-1">
                            <div className="input-group-prepend">
                              <span className="input-group-text">Obowiązkowe</span>
                            </div>
                            <select className="form-select" value={task.obligatory ? 'true' : 'false'} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, obligatory: (t.id !== task.id) ? t.obligatory : (e.target.value === 'true')}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode) || task.type === "REFONLY"} >
                              <option value="true">Tak</option>
                              <option value="false">Nie</option>
                            </select>
                          </div>
                          {task.type !== "REFONLY" && <>
                            <div className="input-group mb-1">
                              <div className="input-group-prepend">
                                <span className="input-group-text">Dziel punkty z kategorią</span>
                              </div>
                              <select className="form-select" value={task.secondaryGroup === null ? 'NONE' : task.secondaryGroup.id} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, secondaryGroup: (t.id !== task.id) ? t.secondaryGroup : (e.target.value === "NONE" ? null : {id: Number.parseInt(e.target.value), name: taskGroups.filter(g => (g.id === Number.parseInt(e.target.value)))[0].name })}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)} >
                                <option value="NONE">Nie dziel punktów</option>
                                {taskGroups.filter((tg) => tg.id !== taskGroup.id).map((tg) => <option key={tg.id} value={tg.id}>{tg.name}</option>)}
                              </select>
                            </div>
                            {task.secondaryGroup !== null && <div className="input-group mb-1 align-items-center">
                              <span className="input-group-text">Podział punktów</span>
                              <span className="input-group-text">Kategoria {task.primaryGroup.name}: {floatToString(task.maxPoints * task.split)} pkt</span>

                              <input className="form-range flex-fill mx-2 w-auto" type="range" min="0" max="1" step={0.5 / task.maxPoints} value={task.split} onChange={(e) => {setTaskGroups(taskGroups.map((tg) => {return {...tg, primaryTasks: tg.primaryTasks.map((t) => {return {...t, split: (t.id !== task.id) ? t.split : Number.parseFloat(e.target.value)}})}})); let m = new Map(taskModifiedMap); m.set(task.id, true); setTaskModifiedMap(m);}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode) || task.maxPoints <= 0} />

                              <span className="input-group-text">Kategoria {task.secondaryGroup.name}: {floatToString(task.maxPoints * (1-task.split))} pkt</span>
                            </div>}
                          </>}
                          <div className="d-flex flex-column mb-1">
                            {taskModifiedMap.get(task.id) && <button className="btn btn-dark ms-auto me-auto" onClick={(e) => modifyTask(task.id)} disabled={(task.type !== "BOOLEAN" && task.type !== "REFONLY" && (task.multiplier === null || task.multiplier <= 0)) || (task.type !== "REFONLY" && task.maxPoints <= 0)}>Zapisz zmiany</button>}
                            <button className="btn btn-danger ms-auto me-auto" onClick={(e) => {setDeleteModalAction("DELETE_TASK"); setDeleteModalArgument(task.id); document.getElementById('openDeleteCallbackModal')?.click()}} disabled={userinfo?.role === "DISTRICT_COORDINATOR" || (categorizationYear.state !== "DRAFT" && !nuclearmode)}>Usuń zadanie</button>
                          </div>
                        </>}
                      </div>
                    })}
                    
                    {newTask.primaryGroup.id !== taskGroup.id &&<div className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                      <button className="btn btn-dark" onClick={(e) => setNewTask({...newTask, primaryGroup: {id: taskGroup.id, name: taskGroup.name}})} disabled={userinfo?.role === "DISTRICT_COORDINATOR"}>Dodaj nowe zadanie</button>
                    </div>}

                    {newTask.primaryGroup.id === taskGroup.id && <div className="list-group-item">
                      <h4 className="text-center fw-bold">Nowe zadanie</h4>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Treść zadania</span>
                        </div>
                        <input className="form-control" type="text" value={newTask.name} onChange={(e) => {setNewTask({...newTask, name: e.target.value})}} />
                      </div>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text h-100">Opis zadania</span>
                        </div>
                        <textarea className="form-control" rows={3} value={newTask.description || ""} onChange={(e) => {setNewTask({...newTask, description: e.target.value})}} />
                      </div>
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Rodzaj zadania</span>
                        </div>
                        <select className="form-select" value={newTask.type} onChange={(e) => {setNewTask({...newTask, type: e.target.value as CategorizationTaskType, obligatory: e.target.value === "REFONLY" ? true : newTask.obligatory})}}>
                          <option value="BOOLEAN">Tak/Nie</option>
                          <option value="LINEAR">Liniowe</option>
                          <option value="LINEAR_REF">Liniowe z odniesieniem</option>
                          <option value="PARABOLIC_REF">Paraboliczne z odniesieniem</option>
                          <option value="REFONLY">Niepunktowane (wartość odniesienia)</option>
                        </select>
                      </div>
                      {newTask.type !== "REFONLY" && <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Maksymalna liczba punktów za zadanie</span>
                        </div>
                        <input className="form-control" type="number" min="0" value={newTask.maxPoints} onChange={(e) => {setNewTask({...newTask, maxPoints: Number.parseInt(e.target.value)})}} />
                      </div>}
                      {newTask.type === "LINEAR" && <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Mnożnik</span>
                        </div>
                        <input className="form-control" type="number" min="0" step="0.5" value={newTask.multiplier || "0"} onChange={(e) => {setNewTask({...newTask, multiplier: Number.parseFloat(e.target.value)})}} />
                      </div>}
                      {(newTask.type === "LINEAR_REF" || newTask.type === "PARABOLIC_REF") && <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Wartość odniesienia</span>
                        </div>
                        <select className="form-select" value={newTask.refValId || "NONE"} onChange={(e) => {setNewTask({...newTask, refValId: Number.parseInt(e.target.value)})}} >
                          <option value="NONE" disabled>Wybierz...</option>
                          {taskGroups.flatMap((tg) => tg.primaryTasks).filter((t) => {if(newTaskRefFilter === undefined) return true; return t.name.includes(newTaskRefFilter) || t.id === newTask.id}).map((t) => {
                            return <option value={t.id}>{t.name}</option>
                          })}
                        </select>
                        <div className="input-group-append">
                          <input className="form-control" type="text" placeholder="Wyszukaj po nazwie..." value={newTaskRefFilter} onChange={(e) => {setNewTaskRefFilter(e.target.value !== "" ? e.target.value : undefined)}} />
                        </div>
                      </div>}
                      <div className="input-group mb-1">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Obowiązkowe</span>
                        </div>
                        <select className="form-select" value={newTask.obligatory ? 'true' : 'false'} onChange={(e) => {setNewTask({...newTask, obligatory: e.target.value === 'true'})}} disabled={newTask.type === "REFONLY"} >
                          <option value="true">Tak</option>
                          <option value="false">Nie</option>
                        </select>
                      </div>
                      {newTask.type !== "REFONLY" && <>
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text">Dziel punkty z kategorią</span>
                          </div>
                          <select className="form-select" value={newTask.secondaryGroup === null ? 'NONE' : newTask.secondaryGroup.id} onChange={(e) => {setNewTask({...newTask, secondaryGroup: (e.target.value === "NONE" ? null : {id: Number.parseInt(e.target.value), name: taskGroups.filter(g => (g.id === Number.parseInt(e.target.value)))[0].name})})}} >
                            <option value="NONE">Nie dziel punktów</option>
                            {taskGroups.filter((tg) => (tg.id !== newTask.primaryGroup.id)).map((tg) => <option key={tg.id} value={tg.id}>{tg.name}</option>)}
                          </select>
                        </div>
                        {newTask.secondaryGroup !== null && <div className="input-group mb-1 align-items-center">
                          <span className="input-group-text">Podział punktów</span>
                          <span className="input-group-text">Kategoria {newTask.primaryGroup.name}: {floatToString(newTask.maxPoints * newTask.split)} pkt</span>

                          <input className="form-range flex-fill mx-2 w-auto" type="range" min="0" max="1" step={0.5 / newTask.maxPoints} value={newTask.split} onChange={(e) => {setNewTask({...newTask, split: Number.parseFloat(e.target.value)})}} disabled={newTask.maxPoints <= 0} />

                          <span className="input-group-text">Kategoria {newTask.secondaryGroup.name}: {floatToString(newTask.maxPoints * (1-newTask.split))} pkt</span>
                        </div>}
                      </>}
                      <div className="d-flex flex-column mb-1">
                        <button className="btn btn-dark" onClick={(e) => createTask()} disabled={newTask.name === "" || ((newTask.type === "LINEAR_REF" || newTask.type === "PARABOLIC_REF") && newTask.refValId === null) || (newTask.type !== "BOOLEAN" && newTask.type !== "REFONLY" && (newTask.multiplier === null || newTask.multiplier <= 0)) || (newTask.type !== "REFONLY" && newTask.maxPoints <= 0)}>Dodaj zadanie</button>
                      </div>
                    </div>}
                  </div>
                </div>}
              </div>
            </div>
          }))}
        </div>

        <div className="modal fade" id="nuclearModeModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="nuclearModalLabel">CZY NA PEWNO?</h5>
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

        <div className="modal fade" id="rebuildRankingModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">CZY NA PEWNO?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><i>Wolniej, wolniej, wstrzymaj konia...</i></p>
                <p><b>Przeliczenie rankingu</b> to operacja której <b>nie da się</b> cofnąć.</p>
                <p>Przeliczenie rankingu spowoduje, że ranking przeliczony przy zamknięciu kategoryzacji zostanie skasowany i nadpisany stanem z teraz. Należy je zastosować na przykład wtedy, gdy: <ul>
                  <li>Zamknąłeś kategoryzację w czerwcu i jakaś sierota przypomniała sobie w sierpniu że chce uzupełnić arkusz, i chcesz żeby była widoczna w rankingu.</li>
                  <li>Przy zamykaniu kategoryzacji zapomniałeś że jakaś drużyna jest <i>ukryta</i> i chcesz żeby jednak się pokazywała w rankingu, więc teraz zmieniłeś żeby była <i>widoczna</i> i potem znowu ją <i>ukryjesz</i></li>
                  <li>Jest jakiś inny powód dla którego chcesz <b>skasować</b> stary stan rankingu.</li>
                </ul></p>
                <p>Niestety to działanie ma wady. Jeżeli od czasu zamknięcia jakaś jednostka została <i>ukryta</i>, to nie będzie widoczna w nowym rankingu. Tak samo jeżeli jednostka zmieniła od tamtego czasu nazwę, to po przeliczeniu będzie widoczna jej nowa nazwa.</p>
                <p><b>Jeśli nie jesteś absolutnie pewny swoich działań, zawróć póki nic nie zepsułeś.</b></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => rebuildRanking()}>DOBRA WIEM CO ROBIĘ</button>
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Wychodzę</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" id="openRebuildRankingModal" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#rebuildRankingModal"/>

        <div className="modal fade" id="deleteRankingModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteRankingModal">CZY NA PEWNO?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><i>Wolniej, wolniej, wstrzymaj konia...</i></p>
                <p><b>Usunięcie rankingu</b> to operacja której <b>nie da się</b> cofnąć.</p>
                <p>Usunięcie rankingu spowoduje, że ranking będzie obliczany dynamicznie, zgodnie z aktualnym stanem. Czasem to dobry pomysł, na przykład gdy:<ul>
                  <li>Otwierasz kategoryzację która wcześniej była zamknięta i chcesz żeby ranking był znowu liczony na bieżąco.</li>
                  <li>Jest jakiś inny powód dla którego chcesz <b>skasować</b> stary stan rankingu.</li>
                </ul></p>
                <p>Niestety to działanie ma wady. Jeżeli usuniesz ranking dla zamkniętej kategoryzacji, to wydajność systemu <b>znacząco spadnie</b>. Rekordy mogą się też nie wyświetlać poprawnie.</p>
                <p><b>Jeśli nie jesteś absolutnie pewny swoich działań, zawróć póki nic nie zepsułeś.</b></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => deleteRanking()}>DOBRA WIEM CO ROBIĘ</button>
                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Wychodzę</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" id="openDeleteRankingModal" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#deleteRankingModal"/>

        <div className="modal fade" id="deleteCallbackModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteCallbackModalLabel">CZY NA PEWNO?</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Tej operacji nie można cofnąć.</p>
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Nie</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={(e) => {
                  if(deleteModalAction === "DELETE_CATYEAR"){
                    deleteCategorizationYear();
                  }else if(deleteModalAction === "DELETE_CATEGORY"){
                    deleteTaskGroup(deleteModalArgument);
                  }else if(deleteModalAction === "DELETE_INITIALTASK"){
                    deleteInitialTask(deleteModalArgument);
                  }else if(deleteModalAction === "DELETE_TASK"){
                    deleteTask(deleteModalArgument);
                  }
                }}>Tak</button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" id="openDeleteCallbackModal" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#deleteCallbackModal"/>
      </>
    );
  };
  
  export default CategorizationLayout;
  