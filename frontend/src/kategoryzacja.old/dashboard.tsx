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
  const [activeTab, setActiveTab] = useState<'summary' | 'categories'>('categories');

  // Mock data - replace with your actual data
  const mockCategories: Category[] = Array.from({ length: 20 }, (_, i) => ({
    id: `cat-${i + 1}`,
    title: `Category ${i + 1}`,
    tasks: Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, j) => ({
      id: `task-${i + 1}-${j + 1}`,
      title: `Task ${j + 1} for Category ${i + 1}`,
      checked: Math.random() > 0.5,
      starred: Math.random() > 0.7,
      category: `Category ${i + 1}`,
    })),
  }));

  const toggleTaskStatus = (taskId: string) => {
    mockCategories.forEach((cat) => {
      cat.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.checked = !task.checked;
        }
      });
    });
  };

  const toggleStar = (taskId: string) => {
    mockCategories.forEach((cat) => {
      cat.tasks.forEach((task) => {
        if (task.id === taskId) {
          task.starred = !task.starred;
        }
      });
    });
  };

  const allTasks = mockCategories.flatMap((cat) => cat.tasks);
  const completedTasks = allTasks.filter((task) => task.checked).length;
  const starredTasks = allTasks.filter((task) => task.starred);

  return (
    <div className="dashboard-layout p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>E-Kategoryzacja</h1>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="starred-filter"
            checked={showStarredOnly}
            onChange={(e) => setShowStarredOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="starred-filter">
            Show starred only
          </label>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            All Categories
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'summary' && (
          <div className="tab-pane fade show active">
            <div className="card mt-3">
              <div className="card-body">
                <h3 className="mb-3">Overall Progress</h3>
                <div className="progress mb-4" style={{ height: '30px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${(completedTasks / allTasks.length) * 100}%` }}
                    aria-valuenow={completedTasks}
                    aria-valuemin={0}
                    aria-valuemax={allTasks.length}
                  >
                    {completedTasks}/{allTasks.length}
                  </div>
                </div>

                <h4 className="mb-3">Starred Tasks ({starredTasks.length})</h4>
                <ul className="list-group">
                  {starredTasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={task.checked}
                        onChange={() => toggleTaskStatus(task.id)}
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
        )}

        {activeTab === 'categories' && (
          <div className="tab-pane fade show active">
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mt-3">
              {mockCategories.map((category) => {
                const filteredTasks = showStarredOnly
                  ? category.tasks.filter((task) => task.starred)
                  : category.tasks;

                return (
                  <div key={category.id} className="col">
                    <div className="card h-100">
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
                                onChange={() => toggleTaskStatus(task.id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;