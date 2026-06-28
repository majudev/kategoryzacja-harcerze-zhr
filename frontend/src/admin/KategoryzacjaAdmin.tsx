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

// xlsx-js-style (a styling-capable fork of SheetJS) is loaded on demand from a
// CDN so it never enters the main bundle. We use the fork instead of plain
// `xlsx` because the community SheetJS build drops cell styling (bold, wrap,
// alignment) on write. The script is fetched only the first time the user
// exports an XLSX file. It still exposes the global as `window.XLSX`.
const XLSX_CDN_URL = "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js";

let xlsxLibLoader: Promise<any> | null = null;
const loadXlsxLib = (): Promise<any> => {
  if ((window as any).XLSX) return Promise.resolve((window as any).XLSX);
  if (xlsxLibLoader) return xlsxLibLoader;

  xlsxLibLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = XLSX_CDN_URL;
    script.async = true;
    script.onload = () => resolve((window as any).XLSX);
    script.onerror = () => {
      xlsxLibLoader = null; // allow a retry on next click
      reject(new Error("Nie udało się pobrać biblioteki XLSX z CDN."));
    };
    document.body.appendChild(script);
  });
  return xlsxLibLoader;
};

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

    const downloadCsv = (initialTasks: Task[], categories: Category[]) => {
      // 1) Build header row
      const header = [
        'Kategoria',
        'Nazwa zadania',
        'Wpisana wartość',
        'Przyznane punkty',
        'Oznaczone gwiazdką'
      ];
    
      // 2) Helper to escape any cell for CSV
      const escapeCell = (cell: string) =>
        `"${cell.replace(/"/g, '""')}"`;
    
      // 3) Build data rows
      const rows: string[][] = [];
    
      // 3a) InitialTasks – always labelled "Wymaganie podstawowe"
      initialTasks.forEach(task => {
        rows.push([
          'Wymaganie podstawowe',              // Kategoria
          task.name,                           // Nazwa zadania
          task.value ? 'Tak' : 'Nie',         // Wpisana wartość (boolean)
          '',                                  // Przyznane punkty (empty)
          ''                                   // Oznaczone gwiazdką (empty)
        ]);
      });
    
      // 3b) Then each Category and its tasks
      categories.forEach(cat => {
        cat.tasks.forEach(task => {
          rows.push([
            cat.name,                          // Kategoria
            task.name,                         // Nazwa zadania
            String(task.value),               // Wpisana wartość (number)
            String(task.points),              // Przyznane punkty
            task.favourite ? 'Tak' : 'Nie'    // Oznaczone gwiazdką
          ]);
        });
      });
    
      // 4) Serialize all rows to a single CSV string
      const csvContent =
        [
          header.map(escapeCell).join(','),             // header line
          ...rows.map(r => r.map(escapeCell).join(',')) // each data line
        ].join('\r\n');
    
      // 5) Create a Blob and trigger a download
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
    
      const link = document.createElement('a');
      link.href = url;
      link.download = `${categorizationDetails?.name} - jednostka ${teaminfo?.name}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const downloadXlsx = async (initialTasks: Task[], categories: Category[]) => {
      let XLSX;
      try {
        XLSX = await loadXlsxLib();
      } catch (err) {
        alert((err as Error).message);
        return;
      }

      // Build the sheet as an array of arrays. SheetJS infers the cell type
      // from each JS value, so numbers stay numeric and nothing needs escaping.
      const header = [
        'Kategoria',
        'Nazwa zadania',
        'Wpisana wartość',
        'Przyznane punkty',
        'Oznaczone gwiazdką'
      ];

      const rows: (string | number)[][] = [header];

      // InitialTasks – always labelled "Wymaganie podstawowe"
      initialTasks.forEach(task => {
        rows.push([
          'Wymaganie podstawowe',              // Kategoria
          task.name,                           // Nazwa zadania
          task.value ? 'Tak' : 'Nie',         // Wpisana wartość (boolean)
          '',                                  // Przyznane punkty (empty)
          ''                                   // Oznaczone gwiazdką (empty)
        ]);
      });

      // Then each Category and its tasks
      categories.forEach(cat => {
        cat.tasks.forEach(task => {
          rows.push([
            cat.name,                          // Kategoria
            task.name,                         // Nazwa zadania
            task.value,                        // Wpisana wartość (number)
            task.points,                       // Przyznane punkty (number)
            task.favourite ? 'Tak' : 'Nie'    // Oznaczone gwiazdką
          ]);
        });
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);

      // Column widths. XLSX stores width in character units (the number shown in
      // Excel's "Column Width" dialog), so we set `wch` for deterministic sizing.
      // cm -> px (1 cm ≈ 37.795 px @96dpi) -> chars (px = chars*7 + 5 padding).
      const cmToWch = (cm: number) => Math.round(((cm * 37.7953) - 5) / 7 * 100) / 100;
      worksheet['!cols'] = [
        { wch: 21 },           // Kategoria
        { wch: cmToWch(5.0) }, // Nazwa zadania
        { wch: cmToWch(3.8) }, // Wpisana wartość
        { wch: 20 },           // Przyznane punkty
        { wch: 20 },           // Oznaczone gwiazdką
      ];

      // Per-cell styling: bold + centered header, wrapped first two columns,
      // centered columns 3-5.
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
          const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
          if (!cell) continue;

          if (r === 0) {
            // Header row
            cell.s = {
              font: { bold: true },
              alignment: { horizontal: 'center', vertical: 'center', wrapText: true }
            };
            continue;
          }

          const alignment: any = { vertical: 'center' };
          if (c === 0 || c === 1) alignment.wrapText = true; // wrap long text
          if (c >= 2) alignment.horizontal = 'center';       // centre columns 3-5
          cell.s = { alignment };
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Arkusz');

      XLSX.writeFile(
        workbook,
        `${categorizationDetails?.name} - jednostka ${teaminfo?.name}.xlsx`
      );
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
                      <h3 className="text-center">Arkusz jednostki {teaminfo?.name} <button className="btn btn-dark btn-sm" onClick={() => downloadCsv(initialTasklist, tasklist)}>Pobierz CSV</button> <button className="btn btn-dark btn-sm" onClick={() => downloadXlsx(initialTasklist, tasklist)}>Pobierz Excela</button></h3>
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
  