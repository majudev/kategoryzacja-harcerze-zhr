import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/modal';
import { UserInfo } from "../App";

const API_ROOT = process.env.REACT_APP_API_URL;

const CategorizationLayout = ({userinfo} : {userinfo: UserInfo | null;}) => {

  const [inputlock, setInputlock] = useState(false);
  const [nuclearmode, setNuclearmode] = useState(false);

  const [newGroup, setNewGroup] = useState<{name: string; displayPriority: number;}>({name: "", displayPriority: 100});
  const [newInitial, setNewInitial] = useState<{text: string; description: string;}|null>(null);

    return (
      <>
        {/* Top stats bar */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Nazwa</h5>
                <div className={"display-6"}>
                  2025
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Status</h5>
                <div className={"display-6 text-success"}>
                  TRWA
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="text-muted mb-3">Dla odważnych</h5>
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={nuclearmode} onChange={(e) => {if(!e.target.checked) setNuclearmode(e.target.checked); else document.getElementById('openNuclearModeModal')?.click();}}/>
                    <label className="form-check-label text-danger">Tryb atomowy</label>
                  </div>
              </div>
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
                      content 1
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      content 2
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      content 3
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
                        <input className="form-control" type="number" min="0" max="10" value="6" disabled={inputlock} />
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max="10" value="2" disabled={inputlock} />
                      </div>
                    </li>
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
                        <input className="form-control" type="number" min="0" max="10" value="6" disabled={inputlock} />
                      </div>
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Minimum symboli <img className="img-src-puszczanska ms-2" style={{ width: '20px', height: '20px' }} /></span>
                        </div>
                        <input className="form-control" type="number" min="0" max="10" value="9" disabled={inputlock} />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups rows */}
        <div className="row row-cols-1 g-4 mt-2">
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

          <div key="initial" className="col">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center">Wymagania podstawowe</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="d-flex mb-3">
                      <div className="w-100">
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text">Treść wymagania</span>
                          </div>
                          <input className="form-control" type="text" value="Drużyna istnieje"/>
                        </div>
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text h-100">Opis wymagania</span>
                          </div>
                          <textarea className="form-control"/>
                        </div>
                      </div>
                      <button className="ms-1 btn btn-dark">Zapisz zmiany</button>
                      <button className="ms-1 btn btn-danger">Usuń</button>
                    </div>
                    <div className="d-flex mb-3">
                      <div className="w-100">
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text">Treść wymagania</span>
                          </div>
                          <input className="form-control" type="text" value="Drużynowy myje zęby raz w tygodniu"/>
                        </div>
                        <div className="input-group mb-1">
                          <div className="input-group-prepend">
                            <span className="input-group-text h-100">Opis wymagania</span>
                          </div>
                          <textarea className="form-control"/>
                        </div>
                      </div>
                      <button className="ms-1 btn btn-dark">Zapisz zmiany</button>
                      <button className="ms-1 btn btn-danger">Usuń</button>
                    </div>
                  </div>
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
                      <button className="ms-1 btn btn-dark" onClick={(e) => setNewInitial(null)}>Dodaj</button>
                    </div>}
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
  