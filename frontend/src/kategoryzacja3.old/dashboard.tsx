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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
    <div className="dashboard-layout vh-100 d-flex flex-column">
      {/* Top Bar */}
      <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">E-Kategoryzacja</h3>
        <div className="d-flex align-items-center gap-3">
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
          <div className="text-nowrap">
            <span className="badge bg-success me-2">
              Completed: {completedTasks}/{allTasks.length}
            </span>
            <span className="badge bg-warning">
              ★ {starredTasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-hidden">
        <div className="h-100 d-flex flex-column">
          {/* Progress Header */}
          <div className="bg-light p-3 border-bottom">
            <div className="progress" style={{height: '10px'}}>
              <div 
                className="progress-bar bg-success" 
                style={{width: `${(completedTasks / allTasks.length) * 100}%`}}
              />
            </div>
          </div>

          {/* Category Columns */}
          <div className="flex-grow-1 overflow-auto">
            <div className="d-flex h-100 px-3 pb-3" style={{gap: '1rem'}}>
              {mockCategories.map(category => {
                const filteredTasks = showStarredOnly 
                  ? category.tasks.filter(t => t.starred)
                  : category.tasks;

                return (
                  <div 
                    key={category.id}
                    className="category-column h-100"
                    style={{minWidth: '300px', maxWidth: '300px'}}
                  >
                    <div className="card h-100 shadow-sm">
                      <div 
                        className="card-header bg-primary text-white d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={() => setExpandedCategory(
                          expandedCategory === category.id ? null : category.id
                        )}
                      >
                        <h5 className="mb-0">{category.title}</h5>
                        <span className="badge bg-light text-dark">
                          {filteredTasks.filter(t => t.checked).length}/{filteredTasks.length}
                        </span>
                      </div>
                      
                      <div className="card-body overflow-auto">
                        <div className="list-group list-group-flush">
                          {filteredTasks.map(task => (
                            <div
                              key={task.id}
                              className="list-group-item d-flex align-items-center"
                            >
                              <input
                                type="checkbox"
                                className="form-check-input me-3"
                                checked={task.checked}
                                onChange={() => toggleTask(task.id)}
                              />
                              <span 
                                className={`flex-grow-1 ${task.checked ? 'text-muted text-decoration-line-through' : ''}`}
                              >
                                {task.title}
                              </span>
                              <button 
                                className="btn btn-link p-0"
                                onClick={() => toggleStar(task.id)}
                              >
                                <i className={`bi bi-star${task.starred ? '-fill' : ''} ${task.starred ? 'text-warning' : 'text-secondary'}`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .category-column {
          transition: all 0.2s ease;
        }
        .category-column:hover {
          transform: translateY(-2px);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .progress-bar {
          transition: width 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;