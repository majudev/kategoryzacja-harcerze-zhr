import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";

const API_ROOT = process.env.REACT_APP_API_URL;

const Tutorial = ({userinfo} : {userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null; team: {}|null; teamAccepted: boolean;} | null}) => {
    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER"){
                if(userinfo.team === null || !userinfo.teamAccepted){
                    console.log("Redirecting to /welcome");
                    navigate("/welcome", {replace: true});
                }
            }
        }
    }, [userinfo]);

    const [initialTasks, setInitialTasks] = useState<Array<{id: number; name: string; value: number;}>>([
      {id: 0, name: "Zadanie podstawowe 1", value: 0},
      {id: 1, name: "Zadanie podstawowe 2", value: 0},
      {id: 2, name: "Zadanie podstawowe 3", value: 0},
    ]);

    const [tasklist, setTasklist] = useState([
      {
        id: 10, 
        name: "Stan jednostki", 
        lesnaThreshold: 5, 
        puszczanskaThreshold: 10, 
        achievedSymbol: 'POLOWA' as ('PUSZCZANSKA' | 'LESNA' | 'POLOWA'), 
        tasks: [
          {
            id: 0,
            name: "Drużyna posiada 3 zastępy",
            maxPoints: 5,
            multiplier: null as (number|null),
            value: 0,
            type: "BOOLEAN" as ("BOOLEAN"|"LINEAR"|"LINEAR_REF"|"PARABOLIC_REF"|"REFONLY"),
            favourite: false,
            obligatory: false,
          },
          {
            id: 1,
            name: "Liczba osób w drużynie",
            maxPoints: 30,
            multiplier: 1 as (number|null),
            value: 0,
            type: "LINEAR" as ("BOOLEAN"|"LINEAR"|"LINEAR_REF"|"PARABOLIC_REF"|"REFONLY"),
            favourite: true,
            obligatory: true,
          },
        ],
      },
      {
        id: 20, 
        name: "Obrzędowość", 
        lesnaThreshold: 3, 
        puszczanskaThreshold: 6, 
        achievedSymbol: 'POLOWA' as ('PUSZCZANSKA' | 'LESNA' | 'POLOWA'), 
        tasks: [
          {
            id: 100,
            name: "Drużyna posiada patrona",
            maxPoints: 5,
            multiplier: null as (number|null),
            value: 0,
            type: "BOOLEAN" as ("BOOLEAN"|"LINEAR"|"LINEAR_REF"|"PARABOLIC_REF"|"REFONLY"),
            favourite: false,
            obligatory: false,
          },
          {
            id: 101,
            name: "Drużyna miała przynajmniej 1 ognisko",
            maxPoints: 2,
            multiplier: null as (number|null),
            value: 0,
            type: "BOOLEAN" as ("BOOLEAN"|"LINEAR"|"LINEAR_REF"|"PARABOLIC_REF"|"REFONLY"),
            favourite: false,
            obligatory: false,
          },
        ],
      }
    ]);

    const renderableCategories = [
      {
        id: -1,
        name: 'Wymagania wstępne',
        tasks: [],

        lesnaThreshold: -1,
        puszczanskaThreshold: -1,

        collectedSplitPoints: -1,
        maxSplitPoints: -1,
        maxFilteredSplitPoints: -1,

        achievedSymbol: "POLOWA" as ('PUSZCZANSKA' | 'LESNA' | 'POLOWA'),
      },
      {
        id: 0,
        name: 'Podsumowanie',
        tasks: tasklist.flatMap(cat => cat.tasks),

        lesnaThreshold: -1,
        puszczanskaThreshold: -1,

        collectedSplitPoints: -1,
        maxSplitPoints: -1,
        maxFilteredSplitPoints: -1,

        achievedSymbol: "POLOWA" as ('PUSZCZANSKA' | 'LESNA' | 'POLOWA'),
      },
      ...tasklist
    ];

    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number>(0);

    const [exampleBooleanTaskValue, setExampleBooleanTaskValue] = useState(false);
    const [exampleLinearTaskValue, setExampleLinearTaskValue] = useState(0);
    const [exampleLinearRefTaskValue, setExampleLinearRefTaskValue] = useState(0);
    const [exampleLinearRefReferenceValue, setExampleLinearRefReferenceValue] = useState(0);
    const [exampleParabolicRefTaskValue, setExampleParabolicRefTaskValue] = useState(0);
    const [exampleParabolicRefReferenceValue, setExampleParabolicRefReferenceValue] = useState(0);
    const [exampleREFONLYReferenceValue, setExampleREFONLYReferenceValue] = useState(0);
    const [exampleREFONLYLinearTaskValue, setExampleREFONLYLinearTaskValue] = useState(0);
    const [exampleREFONLYParabolicTaskValue, setExampleREFONLYParabolicTaskValue] = useState(0);

    const cat = tasklist.filter((group) => group.id === activeCategory)[0];

    return (
      <NavbarOverlay userinfo={userinfo}>
        <div className={`container py-4 mt-5`}>
          <div className="row">
            <div className="col-12 col-lg-8 offset-lg-2 card shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-center mt-3 mb-3">E-Kategoryzacja - z czym to się je?</h3>
                <p className="card-text">
                  Witaj w nowej odsłonie E-Kategoryzacji drużyn harcerzy ZHR! Dużo tu różnych zakładek i przycisków, możesz czuć się zdezorientowany... Nie przejmuj się, przeprowadzimy Cię przez cały proces za rękę.
                </p>
                <p className="d-lg-none d-block text-danger text-center">Uwaga! Elementy interaktywne mogą nie wyświetlać się poprawnie na Twoim urządzeniu. Spróbuj użyć urządzenia z większym ekranem.</p>

                <h4 className="card-title">Interfejs</h4>
                <p className="card-text">
                  <span>Zacznijmy od zakładki <b>E-Kategoryzacja</b>. Gdy w nią wejdziesz po raz pierwszy, zobaczysz taki interfejs:</span>
                  <div className="d-flex flex-column flex-lg-row h-100">
                    <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
                      <div className="p-3 border-bottom">
                        <h4 className="mb-3">Arkusz śródroczny</h4>
                        <ul className="nav nav-underline">
                          <li className="nav-item">
                            <button className={`nav-link active`}>
                              Wszystkie zadania
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="flex-grow-1 overflow-auto">
                        <div className={`p-3 border-bottom bg-white`} style={{ cursor: 'pointer', transition: 'all 0.2s ease' }} >
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Wymagania podstawowe</h6>
                            <span className="badge bg-primary rounded-pill">
                              {initialTasks.filter(t => t.value > 0).length}/{initialTasks.length}
                            </span>
                          </div>
                          <div className="progress mt-2" style={{height: '3px', position: 'relative', overflow: "visible"}}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{width: `${initialTasks.filter(t => t.value > 0).length / initialTasks.length * 100}%`}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto p-4">
                      <div className="task-list">
                        <h4 className="mb-3">Zadania podstawowe</h4>
                        <div className="list-group">
                          {initialTasks.map(task => (
                            <div
                              key={task.id}
                              className="list-group-item list-group-item-action d-flex align-items-center"
                            >
                              <input
                                type="checkbox"
                                className="form-check-input me-3 flex-shrink-0"
                                checked={task.value > 0}
                                onChange={() => setInitialTasks(initialTasks.map(t => {if(t.id === task.id) return { ...t, value: t.value > 0 ? 0 : 1 }; return t;}))}
                              />
                              <span className={`flex-grow-1`}>
                                <span className={`${task.value ? 'text-muted text-decoration-line-through' : ''}`}>{task.name}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span>To zadania które musisz wykonać, aby w ogóle być branym pod uwagę w kategoryzacji. Bez nich Twoja drużyna nie dostanie nawet kategorii polowej.</span>
                </p>
                <p className="card-text text-center">
                  <span><i>Ten poradnik jest interaktywny. Spróbuj zaznaczyć wszystkie trzy zadania jako wykonane.</i></span>
                  {initialTasks.filter(t => t.value > 0).length === initialTasks.length && <span className="text-success">
                    <br/><b>Brawo!</b> Teraz w Twoim interfejsie pojawi się reszta zakładek. Będzie to wyglądać tak jak poniżej.
                  </span>}
                </p>

                <p className="card-text">
                  <p>Po spełnieniu wymagań podstawowych Twoje menu po lewej stronie będzie prezentować się następująco:</p>
                  <div className="d-flex flex-column flex-lg-row h-100">
                    <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
                      <div className="p-3 border-bottom">
                        <h4 className="mb-3">Arkusz śródroczny</h4>
                        <ul className="nav nav-underline">
                          <li className="nav-item">
                            <button
                              className={`nav-link ${showStarredOnly ? 'active' : 'text-muted'}`}
                              onClick={() => setShowStarredOnly(true)}
                            >
                              Moje zadania
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className={`nav-link ${!showStarredOnly ? 'active' : 'text-muted'}`}
                              onClick={() => setShowStarredOnly(false)}
                            >
                              Wszystkie zadania
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="flex-grow-1 overflow-auto">
                        {renderableCategories.map(cat => {
                          return <div 
                            key={cat.id}
                            className={`p-3 border-bottom ${activeCategory === cat.id ? 'bg-white' : ''}`}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">
                                {cat.id === -1 && <i className="bi bi-check-circle-fill" style={{ color: 'green', marginRight: '8px' }}></i>}
                                {cat.id > 0 && <img className={cat.tasks.reduce((prev, t) => {return prev + t.value}, 0) >= cat.puszczanskaThreshold ? "img-src-puszczanska" : cat.tasks.reduce((prev, t) => {return prev + t.value}, 0) >= cat.lesnaThreshold ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px', marginRight: '8px' }} />}
                                {cat.name}
                              </h6>
                              {cat.id !== 0 ?
                                <span className="badge bg-primary rounded-pill">
                                  {cat.id === -1 ?
                                  <>3/3</>
                                  :
                                  showStarredOnly ?
                                  <>{cat.tasks.reduce((prev, task) => {return prev + task.value}, 0)}/{cat.tasks.reduce((prev, task) => {return prev + task.maxPoints}, 0)}</>
                                  :
                                  <>{cat.tasks.reduce((prev, task) => {return prev + task.value}, 0)}</>
                                  }
                                </span>
                              :
                                <div className="d-flex justify-content-center">
                                  <span className="badge bg-primary rounded-pill me-1">{tasklist.filter(group => group.achievedSymbol === "POLOWA").length}</span>
                                  <span className="badge bg-success rounded-pill me-1">{tasklist.filter(group => group.achievedSymbol === "LESNA").length}</span>
                                  <span className="badge bg-danger rounded-pill">{tasklist.filter(group => group.achievedSymbol === "PUSZCZANSKA").length}</span>
                                </div>
                              }
                            </div>
                          </div>;
                        })}
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto p-4">
                      <div className="task-list">
                        <p>Zauważ, że pojawiła się nowa zakładka: "Moje zadania". W systemie <b>E-Kategoryzacji</b> możesz oznaczyć zadania gwiazdką. Pojawią się wtedy w zakładce "Moje zadania".</p>
                        <p>Po co oznaczać zadania gwiazdką? W systemie znajduje się więcej zadań, niż będzie Cię interesować. Na początku roku możesz wybrać zadania na których chcesz się skupić i oznaczyć je gwiazdką. Potem możesz korzystać z widoku "Moje zadania" aby skupić się tylko na tym co istotne.</p>
                        <p className="mt-3">Pojawiły się też inne zakładki. Reprezentują one poszczególne grupy zadań. Każda grupa zadań pozwala Ci zdobyć <b>jeden symbol</b>, który jest widoczny po lewej stronie od nazwy.
                          <br/><img className="img-src-polowa" style={{ width: '20px', height: '20px' }} /> - symbol polowy
                          <br/><img className="img-src-lesna" style={{ width: '20px', height: '20px' }} /> - symbol leśny
                          <br/><img className="img-src-puszczanska" style={{ width: '20px', height: '20px' }} /> - symbol puszczański
                        </p>
                        {showStarredOnly ? <p>
                          W tym widoku po prawej stronie od nazwy widać <span className="badge bg-primary rounded-pill me-1">liczbę zdobytych punktów / liczbę punktów do zdobycia z zadań z gwiazdką</span>.
                        </p>:<p>
                          W tym widoku po prawej stronie od nazwy widać <span className="badge bg-primary rounded-pill me-1">liczbę zdobytych punktów</span>.
                        </p>}
                        <p>Zakładka "Podsumowanie" zawiera skrócone informacje z wszystkich kategorii. Obok jej nazwy znajduje się podsumowanie ile zdobyłeś symboli:
                          <span className="badge bg-primary rounded-pill ms-1">polowych</span>,
                          <span className="badge bg-success rounded-pill ms-1 me-1">leśnych</span> i
                          <span className="badge bg-danger rounded-pill ms-1 me-1">puszczańskich</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </p>

                <p className="card-text">
                  <p>Poniżej możesz sprawdzić, czy na pewno rozumiesz jak działa system <b>E-Kategoryzacja</b>. Jest to pełny widok, zawierający przykładowe zadania. Oznacz dwa wybrane zadania gwiazdką i zobacz że pojawiły się w "Moich zadaniach". Spróbuj przewidzieć co się stanie po wpisaniu wartości do tych zadań. Następnie wpisz je i sprawdź czy Twoje przewidywania się potwierdziły.</p>
                  <div className="d-flex flex-column flex-lg-row h-100">
                    <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
                      <div className="p-3 border-bottom">
                        <h4 className="mb-3">Arkusz śródroczny</h4>
                        <ul className="nav nav-underline">
                          <li className="nav-item">
                            <button
                              className={`nav-link ${showStarredOnly ? 'active' : 'text-muted'}`}
                              onClick={() => setShowStarredOnly(true)}
                            >
                              Moje zadania
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className={`nav-link ${!showStarredOnly ? 'active' : 'text-muted'}`}
                              onClick={() => setShowStarredOnly(false)}
                            >
                              Wszystkie zadania
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="flex-grow-1 overflow-auto">
                        {renderableCategories.map(cat => {
                          return <div 
                            key={cat.id}
                            className={`p-3 border-bottom ${activeCategory === cat.id ? 'bg-white' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">
                                {cat.id === -1 && <i className="bi bi-check-circle-fill" style={{ color: 'green', marginRight: '8px' }}></i>}
                                {cat.id > 0 && <img className={cat.tasks.reduce((prev, t) => {return prev + t.value}, 0) >= cat.puszczanskaThreshold ? "img-src-puszczanska" : cat.tasks.reduce((prev, t) => {return prev + t.value}, 0) >= cat.lesnaThreshold ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px', marginRight: '8px' }} />}
                                {cat.name}
                              </h6>
                              {cat.id !== 0 ?
                                <span className="badge bg-primary rounded-pill">
                                  {cat.id === -1 ?
                                  <>3/3</>
                                  :
                                  showStarredOnly ?
                                  <>{cat.tasks.reduce((prev, task) => {return prev + task.value}, 0)}/{cat.tasks.reduce((prev, task) => {return prev + task.maxPoints}, 0)}</>
                                  :
                                  <>{cat.tasks.reduce((prev, task) => {return prev + task.value}, 0)}</>
                                  }
                                </span>
                              :
                                <div className="d-flex justify-content-center">
                                  <span className="badge bg-primary rounded-pill me-1">{tasklist.filter(group => group.achievedSymbol === "POLOWA").length}</span>
                                  <span className="badge bg-success rounded-pill me-1">{tasklist.filter(group => group.achievedSymbol === "LESNA").length}</span>
                                  <span className="badge bg-danger rounded-pill">{tasklist.filter(group => group.achievedSymbol === "PUSZCZANSKA").length}</span>
                                </div>
                              }
                            </div>
                          </div>;
                        })}
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-auto p-4">
                      <div className="task-list">
                        {activeCategory === -1 ? <>
                          <h4 className="mb-3">Zadania podstawowe</h4>
                          <div className="list-group">
                            {initialTasks.map(task => (
                              <div
                                key={task.id}
                                className="list-group-item list-group-item-action d-flex align-items-center"
                              >
                                <input
                                  type="checkbox"
                                  className="form-check-input me-3 flex-shrink-0"
                                  checked={true}
                                />
                                <span className={`flex-grow-1`}>
                                  <span className={`${task.value ? 'text-muted text-decoration-line-through' : ''}`}>{task.name}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 mb-0"><i>Ten panel jest identyczny jak wcześniej. Normalnie można go edytować, tutaj został zablokowany dla uproszczenia.<br/><br/>Panel wygląda identycznie w zakładkach "Moje zadania" i "Wszystkie zadania".</i></p>
                        </> : activeCategory === 0 ? <>
                          {tasklist.map((category) => {
                            const filteredTasks = showStarredOnly
                              ? category.tasks.filter((task) => task.favourite)
                              : category.tasks;

                            return (
                              <div key={category.id} className="col mb-4">
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
                                            onChange={(e) => setTasklist(tasklist.map(cat => {
                                              const tasks = cat.tasks.map(t => {
                                                if (t.id === task.id) {
                                                  // Create a new task object to avoid mutating state directly
                                                  return { ...t, value: e.target.checked ? t.maxPoints : 0 };
                                                }
                                                return t;
                                              });
                                              return {
                                                ...cat,
                                                tasks: tasks,
                                              };
                                            }))}
                                          />
                                          :
                                          <input
                                            type="text"
                                            className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                                            value={task.value}
                                            placeholder="..."
                                            style={{ width: '42px' }}
                                            onChange={(e) => setTasklist(tasklist.map(cat => {
                                              const tasks = cat.tasks.map(t => {
                                                let newValue = Number.parseInt(e.target.value);
                                                if(Number.isNaN(newValue)) return t;
                                                if(newValue > t.maxPoints) newValue = t.maxPoints;
                                                if (t.id === task.id) {
                                                  // Create a new task object to avoid mutating state directly
                                                  return { ...t, value: newValue };
                                                }
                                                return t;
                                              });
                                              return {
                                                ...cat,
                                                tasks: tasks,
                                              };
                                            }))}
                                          />
                                          }
                                          <span
                                            className={`flex-grow-1 ${task.value ? 'text-muted text-decoration-line-through' : ''}`}
                                          >
                                            {task.name}
                                          </span>
                                          <i
                                            className={`bi bi-star${task.favourite ? '-fill' : ''} text-warning fs-5`}
                                            onClick={() => {if(!task.obligatory) setTasklist(tasklist.map(cat => {
                                              const tasks = cat.tasks.map(t => {
                                                if (t.id === task.id) {
                                                  // Create a new task object to avoid mutating state directly
                                                  return { ...t, favourite: !t.favourite };
                                                }
                                                return t;
                                              });
                                              return {
                                                ...cat,
                                                tasks: tasks,
                                              };
                                            }))}}
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
                          <p className="mt-3 mb-0"><i>W panelu podsumowania nie ma informacji o progach punktowych na poszczególne symbole. To tylko proste podsumowanie wszystkich zadań. Najlepiej spójrz na zakładkę konkretnej grupy zadań.</i></p>
                        </> : <>
                          <h4 className="mb-3">{cat.name}</h4>
                          <div className="list-group">
                            {(showStarredOnly ? cat.tasks.filter(t => t.favourite) : cat.tasks).map(task => (
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
                                  onChange={(e) => setTasklist(tasklist.map(cat => {
                                    const tasks = cat.tasks.map(t => {
                                      if (t.id === task.id) {
                                        // Create a new task object to avoid mutating state directly
                                        return { ...t, value: e.target.checked ? t.maxPoints : 0 };
                                      }
                                      return t;
                                    });
                                    return {
                                      ...cat,
                                      tasks: tasks,
                                    };
                                  }))}
                                />
                                :
                                <input
                                  type="text"
                                  className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                                  value={task.value}
                                  placeholder="..."
                                  style={{ width: '42px' }}
                                  onChange={(e) => setTasklist(tasklist.map(cat => {
                                    const tasks = cat.tasks.map(t => {
                                      let newValue = Number.parseInt(e.target.value);
                                      if(Number.isNaN(newValue)) return t;
                                      if(newValue > t.maxPoints) newValue = t.maxPoints;
                                      if (t.id === task.id) {
                                        // Create a new task object to avoid mutating state directly
                                        return { ...t, value: newValue };
                                      }
                                      return t;
                                    });
                                    return {
                                      ...cat,
                                      tasks: tasks,
                                    };
                                  }))}
                                />
                                }
                                <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                                  {task.name} - {task.type === "REFONLY" ? <b>niepunktowane</b> : <b>{task.value}/{task.maxPoints} pkt</b>}
                                </span>
                                <button 
                                  className="btn p-0 ms-2 d-inline-flex align-items-center"
                                  onClick={() => {if(!task.obligatory) setTasklist(tasklist.map(cat => {
                                    const tasks = cat.tasks.map(t => {
                                      if (t.id === task.id) {
                                        // Create a new task object to avoid mutating state directly
                                        return { ...t, favourite: !t.favourite };
                                      }
                                      return t;
                                    });
                                    return {
                                      ...cat,
                                      tasks: tasks,
                                    };
                                  }))}}
                                >
                                  {task.obligatory && <small className="me-1" style={{ fontSize: "0.7em", fontWeight: "bold" }}>obowiązkowe</small>}
                                  <i className={`bi bi-star${task.favourite ? '-fill' : ''} ${task.favourite ? 'text-warning' : 'text-secondary'}`} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 mb-0"><i>Aby uzyskać symbol <img className="img-src-lesna" style={{ width: '20px', height: '20px' }} />, musisz zdobyć {cat.lesnaThreshold} punktów w tej grupie.</i></p>
                          <p className="mt-3 mb-0"><i>Aby uzyskać symbol <img className="img-src-puszczanska" style={{ width: '20px', height: '20px' }} />, musisz zdobyć {cat.puszczanskaThreshold} punktów w tej grupie.</i></p>
                          {showStarredOnly && <p className="mt-3 mb-0"><i>Gdybyś zrobił wszystkie zadania oznaczone gwiazdką w tej grupie, mógłbyś zyskać {cat.tasks.filter(task => task.favourite).reduce((prev, task) => {return prev + task.maxPoints}, 0)} punktów i zdobyć symbol <img className={cat.tasks.filter(task => task.favourite).reduce((prev, t) => {return prev + t.maxPoints}, 0) >= cat.puszczanskaThreshold ? "img-src-puszczanska" : cat.tasks.filter(task => task.favourite).reduce((prev, t) => {return prev + t.maxPoints}, 0) >= cat.lesnaThreshold ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px', marginRight: '8px' }} /></i></p>}
                        </>}
                      </div>
                    </div>
                  </div>
                </p>

                <h4 className="card-title mt-5">Rodzaje zadań</h4>
                <p className="card-text">
                  W kategoryzacji funkcjonują następujące rodzaje zadań:
                  <ul>
                    <li>Tak/Nie</li>
                    <li>Liniowe - należy wpisać w nich wartość. Liczba punktów za zadanie jest obliczana jako <b>mnożnik * wartość</b>, ale jest ograniczona do <b>max. punktów</b>.</li>
                    <li>Liniowe z odniesieniem - zadanie odnosi się do wartości w innym zadaniu. Liczba punktów za zadanie obliczana jest jako <b>suma punktów = max. punktów * (wartość / wartość odniesienia)</b></li>
                    <li>Paraboliczne z odniesieniem - zadanie odnosi się do wartości w innym zadaniu. Liczba punktów za zadanie obliczana jest jako <b>suma punktów = max. punktów * (wartość / wartość odniesienia)^2</b></li>
                    <li>Tylko wartość odniesienia - zadanie nie jest punktowane. Służy tylko jako wartość odniesienia dla innych zadań.</li>
                  </ul>
                  Zadania z wartością odniesienia mogą się odnosić do dowolnego innego zadania w kategoryzacji. Informacja o tym znajduje się w opisie zadania.
                </p>

                <h5>Przykład zadania Tak/Nie</h5>
                <p className="card-text">
                  <div className="list-group">
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input flex-shrink-0"
                        checked={exampleBooleanTaskValue}
                        style={{ padding: '5px', marginLeft: '11px', marginRight: '27px', marginTop: '0px', height: '1.25em', width: '1.25em' }}
                        onChange={(e) => setExampleBooleanTaskValue(!exampleBooleanTaskValue)}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Przykładowe zadanie Tak/Nie - <b>{exampleBooleanTaskValue ? '5' : '0'}/5 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                  </div>
                  <i>{exampleBooleanTaskValue ? 'Zadanie nie jest oznaczone jako wykonane. Otrzymujesz za nie 0 punktów.' : 'Zadanie jest oznaczone jako wykonane. Otrzymujesz za nie 5 punktów.'}</i>
                </p>

                <h5>Przykład zadania liniowego</h5>
                <p className="card-text">
                  <div className="list-group">
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleLinearTaskValue !== 0 ? exampleLinearTaskValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleLinearTaskValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleLinearTaskValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Przykładowe zadanie liniowe - <b>{Math.min(2 * exampleLinearTaskValue, 10)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                  </div>
                  <i>Mnożnik zadania wynosi <b>2</b>. Punkty za zadanie według wzoru to <b>2*{exampleLinearTaskValue}={2*exampleLinearTaskValue}</b>{(2*exampleLinearTaskValue <= 10) ? '.' : <>, ale można zdobyć maksymalnie 10 punktów, więc przyznano <b>10 punktów</b>.</>}</i>
                </p>

                <h5>Przykład zadania liniowego z odniesieniem</h5>
                <p className="card-text">
                  <div className="list-group">
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleLinearRefReferenceValue !== 0 ? exampleLinearRefReferenceValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleLinearRefReferenceValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleLinearRefReferenceValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Zadanie liniowe - <b>{Math.min(exampleLinearRefReferenceValue, 10)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleLinearRefTaskValue !== 0 ? exampleLinearRefTaskValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleLinearRefTaskValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleLinearRefTaskValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Przykładowe zadanie liniowe z odniesieniem - <b>{Math.min((exampleLinearRefReferenceValue === 0) ? 0 : 10 * exampleLinearRefTaskValue / exampleLinearRefReferenceValue, 10).toFixed(1)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                  </div>
                  <i>Zadanie liniowe z odniesieniem odnosi się do zadania liniowego powyżej. {exampleLinearRefReferenceValue === 0 ? <>Zadanie stanowiące wartość odniesienia ma wartość 0, więc nie można wyliczyć punktów za to zadanie - przyznano <b>0 punktów</b>.</> : <>Punkty za zadanie według wzoru to <b>10*{exampleLinearRefTaskValue}/{exampleLinearRefReferenceValue}={(10*exampleLinearRefTaskValue/exampleLinearRefReferenceValue).toFixed(1)}</b>{(10*exampleLinearRefTaskValue/exampleLinearRefReferenceValue <= 10) ? '.' : <>, ale można zdobyć maksymalnie 10 punktów, więc przyznano <b>10 punktów</b>.</>}</>}</i>
                </p>

                <h5>Przykład zadania parabolicznego z odniesieniem</h5>
                <p className="card-text">
                  <div className="list-group">
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleParabolicRefReferenceValue !== 0 ? exampleParabolicRefReferenceValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleParabolicRefReferenceValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleParabolicRefReferenceValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Zadanie liniowe - <b>{Math.min(exampleParabolicRefReferenceValue, 10)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleParabolicRefTaskValue !== 0 ? exampleParabolicRefTaskValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleParabolicRefTaskValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleParabolicRefTaskValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Przykładowe zadanie liniowe z odniesieniem - <b>{Math.min((exampleParabolicRefReferenceValue === 0) ? 0 : 10 * Math.pow(exampleParabolicRefTaskValue / exampleParabolicRefReferenceValue, 2), 10).toFixed(1)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                  </div>
                  <i>Zadanie paraboliczne z odniesieniem odnosi się do zadania liniowego powyżej. {exampleParabolicRefReferenceValue === 0 ? <>Zadanie stanowiące wartość odniesienia ma wartość 0, więc nie można wyliczyć punktów za to zadanie - przyznano <b>0 punktów</b>.</> : <>Punkty za zadanie według wzoru to <b>10*({exampleParabolicRefTaskValue}/{exampleParabolicRefReferenceValue})^2={(10*Math.pow(exampleParabolicRefTaskValue/exampleParabolicRefReferenceValue, 2)).toFixed(1)}</b>{(10*Math.pow(exampleParabolicRefTaskValue/exampleParabolicRefReferenceValue, 2) <= 10) ? '.' : <>, ale można zdobyć maksymalnie 10 punktów, więc przyznano <b>10 punktów</b>.</>}</>}</i>
                </p>

                <h5>Przykład zadania tylko z wartością odniesienia</h5>
                <p className="card-text">
                  <div className="list-group">
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleREFONLYReferenceValue !== 0 ? exampleREFONLYReferenceValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleREFONLYReferenceValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleREFONLYReferenceValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Przykładowe tylko z wartością odniesienia - <b>niepunktowane</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleREFONLYLinearTaskValue !== 0 ? exampleREFONLYLinearTaskValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleREFONLYLinearTaskValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleREFONLYLinearTaskValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Zadanie liniowe z odniesieniem - <b>{Math.min((exampleREFONLYReferenceValue === 0) ? 0 : 10 * exampleREFONLYLinearTaskValue / exampleREFONLYReferenceValue, 10).toFixed(1)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                    <div className="list-group-item list-group-item-action d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-3 flex-shrink-0 text-center"
                        value={exampleREFONLYParabolicTaskValue !== 0 ? exampleREFONLYParabolicTaskValue : ""}
                        placeholder="..."
                        style={{ width: '42px' }}
                        onChange={(e) => {if(e.target.value === ""){setExampleREFONLYParabolicTaskValue(0); return;} const newVal = Number.parseInt(e.target.value); if(!isNaN(newVal)) setExampleREFONLYParabolicTaskValue(newVal)}}
                      />
                      <span className="flex-grow-1" style={{lineHeight: "1.3"}}>
                        Zadanie paraboliczne z odniesieniem - <b>{Math.min((exampleREFONLYReferenceValue === 0) ? 0 : 10 * Math.pow(exampleREFONLYParabolicTaskValue / exampleREFONLYReferenceValue, 2), 10).toFixed(1)}/10 pkt</b>
                      </span>
                      <button 
                        className="btn p-0 ms-2 d-inline-flex align-items-center"
                      >
                        <i className={`bi bi-star-fill text-warning`} />
                      </button>
                    </div>
                  </div>
                  <i>Zadanie tylko z wartością odniesienia nie jest punktowane, ale jego wartość ma wpływ na zadania które się do niego odnoszą.</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </NavbarOverlay>
    );
  };
  
  export default Tutorial;
  