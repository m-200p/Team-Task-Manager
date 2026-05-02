import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, LayoutGrid, List, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import api from '../services/api';

export default function ProjectPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { tasks, loading, updateTask } = useTasks({ project: id });
  const [project, setProject]           = useState(null);
  const [view, setView]                 = useState('kanban'); // kanban | list
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data)).catch(() => {});
  }, [id]);

  if (!project) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: project.color + '20' }}>
            <span className="w-3 h-3 rounded-full" style={{ background: project.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900">{project.name}</h1>
            {project.description && <p className="text-sm text-ink-400">{project.description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          <div className="flex bg-surface-100 rounded-xl p-1 gap-1">
            <button onClick={() => setView('kanban')} className={`p-1.5 rounded-lg transition-all ${view === 'kanban' ? 'bg-white shadow-card text-brand-600' : 'text-ink-400 hover:text-ink-700'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-card text-brand-600' : 'text-ink-400 hover:text-ink-700'}`}>
              <List size={16} />
            </button>
          </div>

          <button onClick={() => setShowCreateTask(true)} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={15} /> Add Task
          </button>
        </div>
      </div>

      {/* Members strip */}
      <div className="flex items-center gap-2">
        <Users size={14} className="text-ink-300" />
        <div className="flex -space-x-2">
          {project.members?.map(m => (
            <div key={m.user?._id} title={m.user?.name}
              className="w-7 h-7 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-xs font-bold text-brand-600">
              {m.user?.name?.[0]?.toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-xs text-ink-300">{project.members?.length} member{project.members?.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard tasks={tasks} onTaskClick={() => {}} />
      ) : (
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="card text-center py-12 border-2 border-dashed border-surface-200">
              <p className="text-ink-300 text-sm">No tasks yet. Add your first task!</p>
            </div>
          ) : tasks.map(t => (
            <TaskCard key={t._id} task={t} onStatusChange={(id, status) => updateTask(id, { status })} />
          ))}
        </div>
      )}

      {showCreateTask && (
        <CreateTaskModal projectId={id} onClose={() => setShowCreateTask(false)} />
      )}
    </div>
  );
}