import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import Sidebar from "./Sidebar";
import StatsBar from "./StatsBar";
import SummaryLayout from "./SummaryLayout";
import CategoryLayout from "./CategoryLayout";
import InitialTasksLayout from "./InitialTasksLayout";

const API_ROOT = process.env.REACT_APP_API_URL;

export interface CategorizationDetails {
  id: number;
  name: string;

  lesnaLesneThreshold: number;
  lesnaPuszczanskieThreshold: number;
  puszczanskaLesneThreshold: number;
  puszczanskaPuszczanskieThreshold: number;
};

export interface Task {
  id: number;
  name: string;
  description: string|null;
  value: number;
  favourite: boolean;
  
  primaryGroupId: number;
  secondaryGroupId: number|null;
  split: number;

  type: "BOOLEAN" | "LINEAR" | "LINEAR_REF" | "PARABOLIC_REF" | "REFONLY";
  maxPoints: number;
  multiplier: number|null;

  obligatory: boolean;

  points: number;

  primaryGroupName: string | undefined;
  secondaryGroupName: string | undefined;
  primaryPoints: number | undefined;
  secondaryPoints: number | undefined;
  primaryMaxPoints: number | undefined;
  secondaryMaxPoints: number | undefined;
}

export interface Category {
  id: number;
  name: string;

  lesnaThreshold: number;
  puszczanskaThreshold: number;

  collectedSplitPoints: number;
  maxSplitPoints: number;
  maxFilteredSplitPoints: number;

  achievedSymbol: 'PUSZCZANSKA' | 'LESNA' | 'POLOWA';

  tasks: Task[];
}

export interface UserInfo {
  role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN";
  districtAdmin: {id: number; name: string;} | null;
  team: {
    id: number;
    name: string;
    locked: boolean;
  }|null;
  teamAccepted: boolean;
}

const Kategoryzacja = ({userinfo} : {userinfo: UserInfo | null}) => {
    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER"){
                if(userinfo.team === null || !userinfo.teamAccepted){
                    console.log("Redirecting to /welcome");
                    navigate("/welcome", {replace: true});
                }
            }else navigate("/", {replace: true}); // Kick admins outta here
        }

        if(userinfo !== null && userinfo.team !== null && userinfo.teamAccepted){
          updateCategorizationDetails();
          updateInitialTasklist();
          updateTasklist();
        }
    }, [userinfo]);

    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number>(0);

    const [categorizationDetails, setCategorizationDetails] = useState<CategorizationDetails>();
    const [initialTasklist, setInitialTasklist] = useState<Array<Task>>([]);
    const [tasklist, setTasklist] = useState<Array<Category>>([]);

    const locked = userinfo !== null && userinfo.team !== null && userinfo.team.locked;

    const updateCategorizationDetails = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/categorization`);
        setCategorizationDetails(res.data);
      } catch (err: any) {
        setCategorizationDetails(undefined);
      }
    };

    const updateInitialTasklist = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/tasks/initial`);
        setInitialTasklist(res.data);
        const tl = res.data as Array<Task>;
        if(tl.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < tl.length){
          setActiveCategory(-1);
        }
      } catch (err: any) {
        setInitialTasklist([]);
      }
    };

    const updateTasklist = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/tasks/`);
        setTasklist(res.data);
      } catch (err: any) {
        setTasklist([]);
      }
    };
  
    const renderableCategories = [
      {
        id: -1,
        name: 'Wymagania wstępne',
        tasks: initialTasklist,

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
  
    const toggleInitialTask = async (taskId: number, state: boolean) => {
      const newInitialTasklist = initialTasklist.map(task => {
        if (task.id === taskId) {
          // Create a new task object to avoid mutating state directly
          return { ...task, favourite: state };
        }
        return task;
      });
      setInitialTasklist(newInitialTasklist);

      
      try {
        await axios.post(`${API_ROOT}/tasks/initial/${state ? 'mark' : 'unmark'}/${taskId}`);
      } catch (err: any) {
      }

      updateInitialTasklist();
    };

    const toggleMyTask = async (taskId: number, state: boolean) => {
      const newTasklist = tasklist.map(cat => {
        const tasks = cat.tasks.map(task => {
          if (task.id === taskId) {
            // Create a new task object to avoid mutating state directly
            return { ...task, favourite: state };
          }
          return task;
        });
        return {
          ...cat,
          tasks: tasks,
        };
      });
      setTasklist(newTasklist);

      
      try {
        await axios.post(`${API_ROOT}/tasks/${state ? 'select' : 'deselect'}/${taskId}`);
      } catch (err: any) {
      }

      updateTasklist();
    };

    const updateTask = async (taskId: number, value: string) => {
      const numValue = (value === 'true' ? 1 : value === 'false' ? 0 : parseFloat(value));
      if (isNaN(numValue) || numValue < 0) return;

      const newTasklist = tasklist.map(cat => {
        const tasks = cat.tasks.map(task => {
          if (task.id === taskId) {
            // Create a new task object to avoid mutating state directly
            return { ...task, value: numValue };
          }
          return task;
        });
        return {
          ...cat,
          tasks: tasks,
        };
      });
      setTasklist(newTasklist);

      
      try {
        await axios.put(`${API_ROOT}/tasks/${taskId}`, JSON.stringify({value: numValue}), {headers: {"Content-Type": "application/json"}});
      } catch (err: any) {
      }

      updateTasklist();
    };
    

    return (
      <NavbarOverlay userinfo={userinfo}>
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="d-flex flex-column flex-lg-row h-100">
            {/* Desktop Sidebar */}
            <Sidebar type="desktop" renderableCategories={renderableCategories} initialLock={initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length} myTasksMode={showStarredOnly} setMyTasksMode={setShowStarredOnly} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto p-4">
              {/* Mobile Header */}
              <Sidebar type="mobile" renderableCategories={renderableCategories} initialLock={initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length} myTasksMode={showStarredOnly} setMyTasksMode={setShowStarredOnly} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

              {/* Top Stats Cards */}
              {!(initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length) && 
                <StatsBar categorizationDetails={categorizationDetails} categories={tasklist} myTasksMode={showStarredOnly} locked={locked} />
              }

              {/* Task List */}
              <div className="task-list">
                {activeCategory === 0 ?
                  <SummaryLayout categories={tasklist} myTasksMode={showStarredOnly} toggleMyTask={toggleMyTask} updateTask={updateTask} locked={locked} />
                  : activeCategory === -1 ?
                  <InitialTasksLayout tasks={initialTasklist} toggleInitialTask={toggleInitialTask} locked={locked} />
                  :
                  renderableCategories.filter((cat) => cat.id === activeCategory).map((cat) =>
                    <CategoryLayout category={cat} myTasksMode={showStarredOnly} toggleMyTask={toggleMyTask} updateTask={updateTask} locked={locked} />
                  )
                }
              </div>
            </div>
          </div>

          <style>{`
            .nav-underline .nav-link.active {
              border-bottom: 2px solid #0d6efd;
              color: #0d6efd !important;
            }
            .dashboard-layout {
              overflow: hidden;
            }
          `}</style>
        </div>
      </NavbarOverlay>
    );
  };
  
  export default Kategoryzacja;
  