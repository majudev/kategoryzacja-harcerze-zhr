import 'bootstrap/js/dist/tab';
import { UserInfo, Task } from "./Kategoryzacja";

const API_ROOT = process.env.REACT_APP_API_URL;

const InitialTasksLayout = ({tasks, toggleInitialTask} : {tasks: Array<Task>; toggleInitialTask: (taskId: number, state: boolean) => void}) => {
    return (
      <div className="container-fluid row m-0 p-0">
        <div className="col-12 col-md-6 p-0">
          <h4 className="mb-3">Zadania podstawowe</h4>
          <div className="list-group">
            {tasks.map(task => (
              <div
                key={task.id}
                className="list-group-item list-group-item-action d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  className="form-check-input me-3 flex-shrink-0"
                  checked={task.value > 0}
                  onChange={() => toggleInitialTask(task.id, !task.value)}
                />
                <span className={`flex-grow-1 ${task.value ? 'text-muted text-decoration-line-through' : ''}`}>
                  {task.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-12 col-md-6 ps-4 pe-0">
          <div className="card h-100 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Jak to działa?</h5>
            </div>
            <div className="card-body">
              <p>Aby móc dołączyć do rywalizacji w kategoryzacji drużyn harcerzy, musisz najpierw spełnić kilka prostych wymagań.</p>
              <p>Gdy zaznaczysz wszystkie wymagane pola, pojawi się reszta panelu do kategoryzacji.</p>
              <p>Do tego czasu Twoja jednostka nie będzie brana pod uwagę w rankingach.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default InitialTasksLayout;
  