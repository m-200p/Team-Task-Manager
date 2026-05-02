import { format, isPast } from 'date-fns';
import { Calendar, User, AlertTriangle } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';

export default function TaskCard({ task, onClick, onStatusChange }) {
  const overdue = task.isOverdue || (task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done');

  return (
    <div
      onClick={() => onClick?.(task)}
      className="card cursor-pointer hover:shadow-panel hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Overdue warning */}
      {overdue && (
        <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-2">
          <AlertTriangle size={12} /> Overdue
        </div>
      )}

      <p className="text-sm font-semibold text-ink-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
        {task.title}
      </p>

      {task.description && (
        <p className="text-xs text-ink-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between text-xs text-ink-300">
        {task.assignedTo ? (
          <span className="flex items-center gap-1">
            <User size={11} />
            {task.assignedTo.name}
          </span>
        ) : <span />}
        {task.dueDate && (
          <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : ''}`}>
            <Calendar size={11} />
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>

      {/* Status changer (quick action) */}
      {onStatusChange && (
        <select
          value={task.status}
          onChange={e => { e.stopPropagation(); onStatusChange(task._id, e.target.value); }}
          onClick={e => e.stopPropagation()}
          className="mt-3 w-full text-xs bg-surface-50 border border-surface-200 rounded-lg px-2 py-1 text-ink-600 focus:outline-none focus:ring-1 focus:ring-brand-400"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      )}
    </div>
  );
}