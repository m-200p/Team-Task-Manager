import TaskCard from './TaskCard';
import { useTaskStore } from '../../store/taskStore';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: 'bg-surface-200' },
  { id: 'in-progress', label: 'In Progress',  color: 'bg-blue-400' },
  { id: 'review',      label: 'Review',       color: 'bg-purple-400' },
  { id: 'done',        label: 'Done',         color: 'bg-green-400' }
];

export default function KanbanBoard({ tasks, onTaskClick }) {
  const { updateTask } = useTaskStore();

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} className="flex flex-col gap-3">
            {/* Column header */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{col.label}</span>
              <span className="ml-auto text-xs font-mono text-ink-300">{colTasks.length}</span>
            </div>
            {/* Cards */}
            <div className="flex flex-col gap-2 min-h-[120px]">
              {colTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={onTaskClick}
                  onStatusChange={handleStatusChange}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-surface-200 rounded-2xl h-24 text-xs text-ink-200">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}