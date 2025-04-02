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
  const [activeCategory, setActiveCategory] = useState<string>('summary');

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

  const allCategories = [
    {
      id: 'summary',
      title: 'Summary',
      tasks: mockCategories.flatMap(cat => cat.tasks)
    },
    ...mockCategories
  ];

  const toggleTask = (taskId: string) => {
    allCategories.forEach(cat => {
      cat.tasks.forEach(task => {
        if(task.id === taskId) task.checked = !task.checked;
      });
    });
  };

  const toggleStar = (taskId: string) => {
    allCategories.forEach(cat => {
      cat.tasks.forEach(task => {
        if(task.id === taskId) task.starred = !task.starred;
      });
    });
  };

  const allTasks = allCategories.flatMap(cat => cat.tasks);
  const completedTasks = allTasks.filter(t => t.checked).length;
  const starredTasks = allTasks.filter(t => t.starred);

  return (
    <div className="dashboard-layout" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="d-flex flex-column flex-lg-row h-100">
        {/* Desktop Sidebar */}
        <div className="bg-light border-end d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '300px' }}>
          <div className="p-3 border-bottom">
            <h4 className="mb-3">Arkusz śródroczny</h4>
            <ul className="nav nav-underline">
              <li className="nav-item">
                <button
                  className={`nav-link ${!showStarredOnly ? 'active' : 'text-muted'}`}
                  onClick={() => setShowStarredOnly(false)}
                >
                  Wszystkie zadania
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${showStarredOnly ? 'active' : 'text-muted'}`}
                  onClick={() => setShowStarredOnly(true)}
                >
                  Mój arkusz
                </button>
              </li>
            </ul>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {allCategories.map(cat => (
              <div 
                key={cat.id}
                className={`p-3 border-bottom ${activeCategory === cat.id ? 'bg-white' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">{cat.title}</h6>
                  <span className="badge bg-primary rounded-pill">
                    {cat.tasks.filter(t => t.checked).length}/{cat.tasks.length}
                  </span>
                </div>
                <div className="progress mt-2" style={{height: '3px'}}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{width: `${(cat.tasks.filter(t => t.checked).length / cat.tasks.length) * 100}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 overflow-auto p-4">
          {/* Mobile Header */}
          <div className="d-lg-none mb-4">
            <h4 className="mb-3">Arkusz śródroczny</h4>
            <div className="d-flex justify-content-between mb-3">
              <ul className="nav nav-underline">
                <li className="nav-item">
                  <button
                    className={`nav-link ${!showStarredOnly ? 'active' : 'text-muted'}`}
                    onClick={() => setShowStarredOnly(false)}
                  >
                    Wszystkie zadania
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${showStarredOnly ? 'active' : 'text-muted'}`}
                    onClick={() => setShowStarredOnly(true)}
                  >
                    Mój arkusz
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="d-flex overflow-auto mb-3">
              {allCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`btn btn-outline-primary me-2 ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

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
            {allCategories.map(cat => {
              const visibleTasks = showStarredOnly 
                ? cat.tasks.filter(t => t.starred)
                : cat.tasks;

              return (
                <div 
                  key={cat.id}
                  className={`mb-4 ${activeCategory === cat.id ? 'active' : 'd-none'}`}
                >
                  {cat.id === 'summary' ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                      {mockCategories.map((category) => {
                        const filteredTasks = showStarredOnly
                          ? category.tasks.filter((task) => task.starred)
                          : category.tasks;

                        return (
                          <div key={category.id} className="col">
                            <div className="card h-100 shadow-sm">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">{category.title}</h5>
                                <small>
                                  {filteredTasks.filter((t) => t.checked).length}/{filteredTasks.length}
                                </small>
                              </div>
                              <div className="card-body">
                                <ul className="list-group list-group-flush">
                                  {filteredTasks.map((task) => (
                                    <li key={task.id} className="list-group-item d-flex align-items-center">
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
                                      <i
                                        className={`bi bi-star${task.starred ? '-fill' : ''} text-warning fs-5`}
                                        onClick={() => toggleStar(task.id)}
                                        style={{ cursor: 'pointer' }}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              );
            })}
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
  );
};

export default DashboardLayout;