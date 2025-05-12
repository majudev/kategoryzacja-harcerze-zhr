import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/modal';
import { UserInfo } from "../App";
import { CategorizationMenu } from "./Admin";

const API_ROOT = process.env.REACT_APP_API_URL;

const NewCategorizationLayout = ({userinfo, availableCategorizations, reloadCategorizationsHook} : {userinfo: UserInfo | null; availableCategorizations: Array<CategorizationMenu>; reloadCategorizationsHook : React.Dispatch<React.SetStateAction<boolean>>}) => {
  useEffect(() => {
    // Reset the state
    setName("");
    setSourceId(-1);
  }, [availableCategorizations]);

  const [name, setName] = useState("");
  const [sourceId, setSourceId] = useState(-1);

  const createCategorization = async () => {
    try {
      const res = await axios.post(`${API_ROOT}/admin/categorization`, {
        name: name,
        sourceId: sourceId > 0 ? sourceId : undefined,
      });
      setName("");
      setSourceId(-1);
      reloadCategorizationsHook(true);
    } catch (err: any) {
      alert("Wystąpił błąd");
    }
  };

    return (
      <>
        {/* Groups rows */}
        <div className="row row-cols-1 g-4 mt-2">
          <div key="nowa" className="col">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-center">Utwórz nowy arkusz kategoryzacji</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Nazwa</span>
                      </div>
                      <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="input-group mb-1">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Skopiuj z</span>
                      </div>
                      <select className="form-control" value={sourceId} onChange={(e) => setSourceId(parseInt(e.target.value))}>
                        <option value={-1}>Pusty arkusz (nie kopiuj)</option>
                        {availableCategorizations.map((categorizationYear) => {
                          return <option value={categorizationYear.id}>{categorizationYear.name} {categorizationYear.state === "OPEN" ? "[AKTYWNA]" : categorizationYear.state === "FINISHED" ? "[ZAKOŃCZONA]" : "[DRAFT]"}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="list-group-item text-center" style={{borderBottomLeftRadius: '0', borderBottomRightRadius: '0', borderBottom: '0'}}>
                    <button className="btn btn-danger" onClick={(e) => createCategorization()}>Utwórz arkusz</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default NewCategorizationLayout;
  