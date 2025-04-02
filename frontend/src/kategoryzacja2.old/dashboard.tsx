import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  checked: boolean;
  starred: boolean;
  category: string;
}

interface Category {
  id: string;
  title: string;
  tasks: Task[];
}

const DashboardLayout = () => {
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data
  const mockCategories: Category[] = Array.from({length: 20}, (_, i) => ({
    id: `cat-${i+1}`,
    title: `Category ${i+1}`,
    tasks: Array.from({length: 5}, (_, j) => ({
      id: `task-${i+1}-${j+1}`,
      title: `Task ${j+1} for Category ${i+1}`,
      checked: Math.random() > 0.5,
      starred: Math.random() > 0.7,
      category: `Category ${i+1}`
    }))
  }));

  // Toggle functions
  const toggleTask = (taskId: string) => {
    mockCategories.forEach(cat => {
      cat.tasks.forEach(task => {
        if(task.id === taskId) task.checked = !task.checked;
      });
    });
  };

  const toggleStar = (taskId: string) => {
    mockCategories.forEach(cat => {
      cat.tasks.forEach(task => {
        if(task.id === taskId) task.starred = !task.starred;
      });
    });
  };

  // Calculate statistics
  const allTasks = mockCategories.flatMap(cat => cat.tasks);
  const completedTasks = allTasks.filter(t => t.checked).length;
  const starredTasks = allTasks.filter(t => t.starred);

  return (
    <div className="dashboard-layout vh-100">
      <div className="d-flex flex-column flex-lg-row h-100">
        {/* Sidebar */}
        <div className={`category-sidebar bg-light border-end ${sidebarOpen ? 'w-lg-300px' : 'collapsed'}`}>
          <div className="p-3 border-bottom">
            <button 
              className="btn btn-primary w-100 mb-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '◀ Hide' : '▶ Categories'}
            </button>
            
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showStarredOnly}
                onChange={(e) => setShowStarredOnly(e.target.checked)}
              />
              <label className="form-check-label">
                Show Starred Only
              </label>
            </div>
          </div>

          <div className="overflow-auto h-100">
            {mockCategories.map(cat => {
              const visibleTasks = showStarredOnly 
                ? cat.tasks.filter(t => t.starred)
                : cat.tasks;
              
              return (
                <div 
                  key={cat.id}
                  className={`category-item p-3 border-bottom ${activeCategory === cat.id ? 'bg-white' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">{cat.title}</h6>
                    <span className="badge bg-primary rounded-pill">
                      {visibleTasks.filter(t => t.checked).length}/{visibleTasks.length}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="progress mt-2" style={{height: '3px'}}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${(visibleTasks.filter(t => t.checked).length / visibleTasks.length) * 100}%`}}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 overflow-auto p-4">
          {/* Summary Cards */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="text-muted mb-3">Total Tasks</h5>
                  <div className="d-flex align-items-center">
                    <div className="display-4 fw-bold">{allTasks.length}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="text-muted mb-3">Completed</h5>
                  <div className="d-flex align-items-center">
                    <div className="display-4 fw-bold">{completedTasks}</div>
                    <span className="ms-2 text-success">
                      ({Math.round((completedTasks / allTasks.length) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="text-muted mb-3">Starred</h5>
                  <div className="display-4 fw-bold">{starredTasks.length}</div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="text-muted mb-3">Current Progress</h5>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{width: `${(completedTasks / allTasks.length) * 100}%`}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="task-list">
            {mockCategories.map(cat => {
              const visibleTasks = showStarredOnly 
                ? cat.tasks.filter(t => t.starred)
                : cat.tasks;

              return (
                <div 
                  key={cat.id}
                  className={`category-tasks mb-4 ${activeCategory === cat.id ? 'active' : 'd-none'}`}
                >
                  <h4 className="mb-3">{cat.title} Tasks</h4>
                  <div className="list-group">
                    {visibleTasks.map(task => (
                      <div
                        key={task.id}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-3 flex-shrink-0"
                          checked={task.checked}
                          onChange={() => toggleTask(task.id)}
                        />
                        <span className={`flex-grow-1 ${task.checked ? 'text-muted text-decoration-line-through' : ''}`}>
                          {task.title}
                        </span>
                        <button 
                          className="btn btn-link p-0 ms-2"
                          onClick={() => toggleStar(task.id)}
                        >
                          <i className={`bi bi-star${task.starred ? '-fill' : ''} ${task.starred ? 'text-warning' : 'text-secondary'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .category-sidebar {
          transition: width 0.3s ease;
          width: 300px;
        }
        .category-sidebar.collapsed {
          width: 60px;
          overflow: hidden;
        }
        .category-item {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-item:hover {
          background-color: rgba(0,0,0,0.05);
        }
        .w-lg-300px {
          width: 300px !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;