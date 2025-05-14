import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import translate from "../translator";
import NavbarOverlay from "../common/NavbarOverlay";
import 'bootstrap/js/dist/tab';
import Sidebar from "../kategoryzacja/Sidebar";
import StatsBar from "../kategoryzacja/StatsBar";
import SummaryLayout from "../kategoryzacja/SummaryLayout";
import InitialTasksLayout from "../kategoryzacja/InitialTasksLayout";
import CategoryLayout from "../kategoryzacja/CategoryLayout";
import { CategorizationDetails, Category, CategoryInfo, Task, UserInfo } from "../kategoryzacja/Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

interface TeamInfo {
  id: number;
  name: string;
  shadow: boolean;
  createdAt: Date;
  locked: boolean;
  district: {
      id: number;
      name: string;
  };
}

const KategoryzacjaAdmin = ({userinfo} : {userinfo: UserInfo | null}) => {
    const { teamId, categorizationYearId } = useParams();

    const navigate = useNavigate();

    // After hook has executed - check routes HERE
    useEffect(() => {
        if(userinfo !== null){
            if(userinfo.role === "USER") navigate("/", {replace: true}); // Kick users outta here
        }

        if(userinfo !== null && userinfo.role !== "USER"){
          updateTeamInfo();
          updateCategorizationDetails();
          updateInitialTasklist();
          updateTasklist();
        }
    }, [userinfo]);

    const [showStarredOnly, setShowStarredOnly] = useState(false);
    const [activeCategory, setActiveCategory] = useState<number>(0);

    const [teaminfo, setTeaminfo] = useState<TeamInfo|null>(null);
    const [categorizationDetails, setCategorizationDetails] = useState<CategorizationDetails>();
    const [initialTasklist, setInitialTasklist] = useState<Array<Task>>([]);
    const [tasklist, setTasklist] = useState<Array<Category>>([]);
    const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>({
      category: 'POLOWA' as ('POLOWA' | 'LESNA' | 'PUSZCZANSKA'),
      nextCategory: 'POLOWA' as ('POLOWA' | 'LESNA' | 'PUSZCZANSKA'),
      tokens: {
        polowa: 0,
        lesna: 0,
        puszczanska: 0,
      },
      missingTokens: {
        lesna: 0,
        puszczanska: 0,
      },
      points: 0,
    });

    const [noActiveCategorization, setNoActiveCategorization] = useState(false);

    const locked = categorizationDetails?.state !== "OPEN" || teaminfo?.locked === true;

    const updateTeamInfo = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/admin/teams/${teamId}`);
        setTeaminfo(res.data);
      } catch (err: any) {
      }
    };

    const updateCategorizationDetails = async () => {
      updateCategoryInfo();
      try {
        const res = await axios.get(`${API_ROOT}/categorization/${categorizationYearId}`);
        setCategorizationDetails(res.data);
        setNoActiveCategorization(false);
      } catch (err: any) {
        setCategorizationDetails(undefined);

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
      
          if (status === 409) {
            setNoActiveCategorization(true);
          }
        }
      }
    };

    const updateCategoryInfo = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/categorization/category/${categorizationYearId}/of/${teamId}`);
        setCategoryInfo(res.data);
      } catch (err: any) {
      }
    };

    const updateInitialTasklist = async () => {
      try {
        const res = await axios.get(`${API_ROOT}/tasks/initial/${categorizationYearId}/of/${teamId}`);
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
      updateCategoryInfo();
      try {
        const res = await axios.get(`${API_ROOT}/tasks/${categorizationYearId}/of/${teamId}`);
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
      /// DUMMY CALLBACK - no toggling tasks in admin mode
    };

    const toggleMyTask = async (taskId: number, state: boolean) => {
      /// DUMMY CALLBACK - no toggling tasks in admin mode
    };

    const updateTask = async (taskId: number, value: string) => {
      /// DUMMY CALLBACK - no toggling tasks in admin mode
    };
    

    return (
      <NavbarOverlay userinfo={userinfo}>
        {noActiveCategorization ? 
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="row g-4 mt-4">
            <div className="col-12">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="text-center m-3">Aktualnie nie ma trwającej kategoryzacji. Zapraszamy później!</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="d-flex flex-column flex-lg-row h-100">
            {/* Desktop Sidebar */}
            <Sidebar type="desktop" renderableCategories={renderableCategories} initialLock={initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length} myTasksMode={showStarredOnly} setMyTasksMode={setShowStarredOnly} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

            {/* Main Content */}
            <div className="flex-grow-1 overflow-auto p-4">
              {/* Mobile Header */}
              <Sidebar type="mobile" renderableCategories={renderableCategories} initialLock={initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length} myTasksMode={showStarredOnly} setMyTasksMode={setShowStarredOnly} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>

              {/* Team information */}
              <div className="row g-4 mb-4">
                <div className="col-12">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h3 className="text-center">Arkusz jednostki {teaminfo?.name}</h3>
                      <p className="text-center mb-0">{teaminfo?.district.name}</p>
                      <p className="text-center fst-italic mb-0">Arkusz wyświetlany w trybie tylko do odczytu!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Stats Cards */}
              {!(initialTasklist.reduce((prev, x) => (x.value ? prev+1 : prev), 0) < initialTasklist.length) && 
                <StatsBar activeCategory={activeCategory <= 0 ? null : renderableCategories.filter((cat) => cat.id === activeCategory)[0]} categoryInfo={categoryInfo} />
              }

              {/* Locked categorization info */}
              {locked && <div className="row g-4 mb-4">
                <div className="col-12">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <h5 className="text-center mb-3">Twój arkusz został zatwierdzony przez administratora i nie możesz go już edytować.</h5>
                    </div>
                  </div>
                </div>
              </div>}

              {/* Task List */}
              <div className="task-list">
                {activeCategory === 0 ?
                  <SummaryLayout categories={tasklist} myTasksMode={showStarredOnly} toggleMyTask={toggleMyTask} updateTask={updateTask} locked={locked} />
                  : activeCategory === -1 ?
                  <InitialTasksLayout tasks={initialTasklist} toggleInitialTask={toggleInitialTask} locked={locked} />
                  :
                  renderableCategories.filter((cat) => cat.id === activeCategory).map((cat) =>
                    <CategoryLayout categories={tasklist} category={cat} myTasksMode={showStarredOnly} toggleMyTask={toggleMyTask} updateTask={updateTask} locked={locked} />
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
        </div>}
      </NavbarOverlay>
    );
  };
  
  export default KategoryzacjaAdmin;
  