import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { CategorizationDetails, Category, CategoryInfo, UserInfo } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const StatsBar = ({activeCategory, categoryInfo} : {activeCategory: Category; categoryInfo: CategoryInfo}) => {
    const groupToken = activeCategory.collectedSplitPoints >= activeCategory.puszczanskaThreshold ? 'PUSZCZANSKA' : activeCategory.collectedSplitPoints >= activeCategory.lesnaThreshold ? 'LESNA' : 'POLOWA';

    return (
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Symbol w obszarze</h5>
              <div className={"display-4 " + (groupToken === 'PUSZCZANSKA' ? "category-img-puszczanska" : groupToken === 'LESNA' ? "category-img-lesna" : "category-img-polowa")} style={{color: "rgba(0, 0, 0, 0)"}}>
                c
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              {/*<h5 className="text-muted mb-3">Następna kategoria</h5>*/}
              <div className="text-justify">
                Aby uzyskać kategorię <img className={categoryInfo.nextCategory === 'PUSZCZANSKA' ? "img-src-puszczanska" : categoryInfo.nextCategory === 'LESNA' ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px' }} />,
                musisz zdobyć jeszcze:
                <table>
                  {categoryInfo.missingTokens.puszczanska > 0 && <tr>
                    <td className="pe-2">{categoryInfo.missingTokens.puszczanska}x</td>
                    <td><img className="img-src-puszczanska" style={{ width: '30px', height: '30px' }} /></td>
                  </tr>}
                  {categoryInfo.missingTokens.lesna > 0 && <tr>
                    <td className="pe-2">{categoryInfo.missingTokens.lesna}x</td>
                    <td>
                      <img className="img-src-lesna" style={{ width: '30px', height: '30px' }} />
                      <small className="ms-2">
                        (lub
                        <img className="img-src-puszczanska ms-1" style={{ width: '14px', height: '14px' }} />)
                      </small>
                    </td>
                  </tr>}
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Twoje symbole</h5>
              <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-center flex-column">
                    <img className="img-src-polowa" style={{ width: '40px', height: '40px' }} />
                    <span className="text-center fw-bold">{categoryInfo.tokens.polowa}</span>
                  </div>
                  <div className="d-flex justify-content-center flex-column">
                    <img className="img-src-lesna" style={{ width: '40px', height: '40px' }} />
                    <span className="text-center fw-bold">{categoryInfo.tokens.lesna}</span>
                  </div>
                  <div className="d-flex justify-content-center flex-column">
                    <img className="img-src-puszczanska" style={{ width: '40px', height: '40px' }} />
                    <span className="text-center fw-bold">{categoryInfo.tokens.puszczanska}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Kategoria</h5>
              <div className="d-flex">
                <div className="flex-fill">
                  <div className={"display-4 " + (categoryInfo.category === 'PUSZCZANSKA' ? "category-img-puszczanska" : categoryInfo.category === 'LESNA' ? "category-img-lesna" : "category-img-polowa")} style={{color: "rgba(0, 0, 0, 0)"}}>
                    c
                  </div>
                </div>
                <div className="flex-fill text-center align-self-center">
                  <h4>{categoryInfo.points.toFixed(0)}<br/>pkt</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default StatsBar;
  