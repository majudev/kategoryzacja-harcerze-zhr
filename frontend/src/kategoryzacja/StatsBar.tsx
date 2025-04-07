import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import { CategorizationDetails, Category, UserInfo } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const StatsBar = ({userinfo, categorizationDetails, categories, myTasksMode} : {categorizationDetails: CategorizationDetails|undefined; userinfo: UserInfo | null; categories: Array<Category>; myTasksMode: boolean}) => {
    const allTasks = categories.flatMap(cat => cat.tasks);
    const uniqueTasks = Array.from(
      new Map(allTasks.map(task => [task.id, task])).values()
    );
    const completedTasks = uniqueTasks.filter(t => t.value).length;
    const starredTasks = uniqueTasks.filter(t => t.favourite);

    // Duplicate code from back-end for speed gains
    const polowa = categories.filter((taskGroup) => taskGroup.achievedSymbol === 'POLOWA').length;
    const lesna = categories.filter((taskGroup) => taskGroup.achievedSymbol === 'LESNA').length;
    const puszczanska = categories.filter((taskGroup) => taskGroup.achievedSymbol === 'PUSZCZANSKA').length;

    let category = 'POLOWA';
    const effectiveLesnaTokens = lesna + puszczanska;
    if(categorizationDetails){
      if(puszczanska >= categorizationDetails.puszczanskaPuszczanskieThreshold && effectiveLesnaTokens - categorizationDetails.lesnaPuszczanskieThreshold >= categorizationDetails.puszczanskaLesneThreshold) {
        category = 'PUSZCZANSKA';
      }else if(puszczanska >= categorizationDetails.lesnaPuszczanskieThreshold && effectiveLesnaTokens - categorizationDetails.lesnaPuszczanskieThreshold >= categorizationDetails.lesnaLesneThreshold){
        category = 'LESNA';
      }
    }
    
    let nextCategory = 'LESNA';
    if (category === 'LESNA') nextCategory = 'PUSZCZANSKA';
    
    let requiredEffective = 0;
    let requiredPuszczanska = 0;
      
    if(categorizationDetails){
      if (nextCategory === 'LESNA') {
        requiredEffective = categorizationDetails.lesnaLesneThreshold;
        requiredPuszczanska = categorizationDetails.lesnaPuszczanskieThreshold;
      } else if (nextCategory === 'PUSZCZANSKA') {
        requiredEffective = categorizationDetails.puszczanskaLesneThreshold;
        requiredPuszczanska = categorizationDetails.puszczanskaPuszczanskieThreshold;
      }
    }
      
    const missingPuszczanska = Math.max(0, requiredPuszczanska - puszczanska);
    const effectiveAfterPuszczanska = Math.max(0, effectiveLesnaTokens - missingPuszczanska);
    const missingEffective = Math.max(0, requiredEffective - effectiveAfterPuszczanska);

    return (
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Kategoria</h5>
              <div className={"display-4 " + (category === 'PUSZCZANSKA' ? "category-img-puszczanska" : category === 'LESNA' ? "category-img-lesna" : "category-img-polowa")} style={{color: "rgba(0, 0, 0, 0)"}}>
                c
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Następna kategoria</h5>
              <div className="text-justify">
                Aby uzyskać kategorię <img className={nextCategory === 'PUSZCZANSKA' ? "img-src-puszczanska" : nextCategory === 'LESNA' ? "img-src-lesna" : "img-src-polowa"} style={{ width: '20px', height: '20px' }} />,
                musisz zdobyć jeszcze:
                <table>
                  {missingPuszczanska > 0 && <tr>
                    <td className="pe-2">{missingPuszczanska}x</td>
                    <td><img className="img-src-puszczanska" style={{ width: '30px', height: '30px' }} /></td>
                  </tr>}
                  {missingEffective > 0 && <tr>
                    <td className="pe-2">{missingEffective}x</td>
                    <td>
                      <img className="img-src-lesna" style={{ width: '30px', height: '30px' }} />
                      lub
                      <img className="img-src-puszczanska" style={{ width: '30px', height: '30px' }} />
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
              <h5 className="text-muted mb-3">Twoje tokeny</h5>
              <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-center flex-column">
                    <img className="img-src-polowa" style={{ width: '40px', height: '40px' }} />
                    <span className="text-center fw-bold">{polowa}</span>
                  </div>
                  <div className="d-flex justify-content-center flex-column">
                    <img className="img-src-lesna" style={{ width: '40px', height: '40px' }} />
                    <span className="text-center fw-bold">{lesna}</span>
                  </div>
                  <div className="d-flex justify-content-center flex-column">
                    <img className="img-src-puszczanska" style={{ width: '40px', height: '40px' }} />
                    <span className="text-center fw-bold">{puszczanska}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="text-muted mb-3">Progress</h5>
              <div className="progress" style={{height: '8px'}}>
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${(completedTasks / starredTasks.length) * 100}%`}}
                />
              </div>
              <span className="text-end text-success">
                {Math.round((completedTasks / starredTasks.length) * 100)}%
              </span>
              <p className="fst-italic mt-2 mb-0">Do boju!</p>
            </div>
          </div>
        </div>*/}
      </div>
    );
  };
  
  export default StatsBar;
  