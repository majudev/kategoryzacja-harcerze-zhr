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

const API_ROOT = process.env.REACT_APP_API_URL;

export interface Task {
  id: number;
  name: string;
  checked: boolean;
  favourite: boolean;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  tasks: Task[];
}

export interface UserInfo {
  role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN";
  districtAdmin: {id: number; name: string;} | null;
  team: {
    id: number;
    name: string;
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
          updateTasklist();
        }
    }, [userinfo]);

    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number>(0);

    const [tasklist, setTasklist] = useState<Array<Category>>([]);

    const updateTasklist = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/tasks/`);
        setTasklist(res.data);
      } catch (err: any) {
        setTasklist([]);
      }
    };

    //const updateValue = ;

    /// TODO: insert some real categories in here
    /*const categories: Category[] = Array.from({length: 20}, (_, i) => ({
      id: `cat-${i+1}`,
      title: `Category ${i+1}`,
      tasks: Array.from({length: 5}, (_, j) => ({
        id: `task-${i+1}-${j+1}`,
        title: `Task ${j+1} for Category ${i+1}`,
        checked: Math.random() > 0.5,
        starred: Math.random() > 0.7,
        category: `Category ${i+1}`
      }))
    }));*/
  
    const renderableCategories = [
      {
        id: 0,
        name: 'Podsumowanie',
        tasks: tasklist.flatMap(cat => cat.tasks)
      },
      ...tasklist
    ];
  
    const toggleTask = (taskId: number) => {
      renderableCategories.forEach(cat => {
        cat.tasks.forEach(task => {
          if(task.id === taskId) task.checked = !task.checked;
        });
      });
    };
  
    const toggleMyTask = (taskId: number, state: boolean) => {
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
    };
    

    return (
      <NavbarOverlay userinfo={userinfo}>
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="d-flex flex-column flex-lg-row h-100">
            {/* Desktop Sidebar */}
            <Sidebar type="desktop" userinfo={userinfo} renderableCategories={renderableCategories} myTasksMode={showStarredOnly} setMyTasksMode={setShowStarredOnly} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto p-4">
              {/* Mobile Header */}
              <Sidebar type="mobile" userinfo={userinfo} renderableCategories={renderableCategories} myTasksMode={showStarredOnly} setMyTasksMode={setShowStarredOnly} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

              {/* Top Stats Cards */}
              <StatsBar userinfo={userinfo} categories={tasklist} myTasksMode={showStarredOnly} />

              {/* Task List */}
              <div className="task-list">
                {activeCategory === 0 ?
                  <SummaryLayout userinfo={userinfo} categories={tasklist} myTasksMode={showStarredOnly} toggleMyTask={toggleMyTask}/>
                :
                  renderableCategories.filter((cat) => cat.id === activeCategory).map((cat) =>
                    <CategoryLayout userinfo={userinfo} category={cat} myTasksMode={showStarredOnly} toggleMyTask={toggleMyTask}/>
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
  