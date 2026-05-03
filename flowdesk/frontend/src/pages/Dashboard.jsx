import { useState, useEffect, useRef } from 'react';
import {
  Plus, CheckCircle2, Clock, AlertTriangle, BarChart3,
  X, Save, Trash2, Lock, Calendar, User, ChevronRight,
  Zap, UserPlus, Sparkles, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { format, isPast, differenceInDays } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';

// ─── Constants ───────────────────────────────────────────
const STATUS_COLS = [
  { id: 'todo',        label: 'To Do',       color: '#9ca3af' },
  { id: 'in-progress', label: 'In Progress',  color: '#3b82f6' },
  { id: 'review',      label: 'Review',       color: '#8b5cf6' },
  { id: 'done',        label: 'Done',         color: '#22c55e' },
];

const PRIORITY_STYLES = {
  low:      'bg-surface-100 text-ink-400',
  medium:   'bg-amber-50 text-amber-600',
  high:     'bg-orange-50 text-orange-600',
  critical: 'bg-red-50 text-red-600',
};

const STATUS_STYLES = {
  'todo':        'bg-surface-100 text-ink-400',
  'in-progress': 'bg-blue-50 text-blue-600',
  'review':      'bg-purple-50 text-purple-600',
  'done':        'bg-green-50 text-green-600',
};

// ─── Project Health Score ────────────────────────────────
function calcHealthScore(project, tasks) {
  const pt = tasks.filter(t =>
    t.project === project._id || t.project?._id === project._id
  );
  if (pt.length === 0) return { score: 100, label: 'Healthy', color: '#22c55e', reasons: [] };

  let score = 100;
  const reasons = [];
  const now = new Date();

  const done     = pt.filter(t => t.status === 'done').length;
  const overdue  = pt.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'done');
  const stuck    = pt.filter(t => t.status === 'in-progress' && t.updatedAt && differenceInDays(now, new Date(t.updatedAt)) >= 3);
  const highPend = pt.filter(t => (t.priority === 'high' || t.priority === 'critical') && t.status !== 'done');
  const doneRatio = done / pt.length;

  if (overdue.length > 0)   { score -= overdue.length * 12; reasons.push(`${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`); }
  if (stuck.length > 0)     { score -= stuck.length * 8;    reasons.push(`${stuck.length} task${stuck.length > 1 ? 's' : ''} stuck 3+ days`); }
  if (highPend.length > 0)  { score -= highPend.length * 6; reasons.push(`${highPend.length} high-priority pending`); }
  if (doneRatio < 0.3 && pt.length > 3) { score -= 10; reasons.push('Low completion rate'); }

  score = Math.max(0, Math.min(100, score));

  let label, color;
  if (score >= 75)      { label = 'Healthy';  color = '#22c55e'; }
  else if (score >= 45) { label = 'At Risk';  color = '#f59e0b'; }
  else                  { label = 'Critical'; color = '#ef4444'; }

  return { score, label, color, reasons };
}

// ─── Health Score Badge ──────────────────────────────────
function HealthBadge({ score, label, color, reasons }) {
  const [show, setShow] = useState(false);
  const barW = `${score}%`;

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {/* Mini score bar */}
        <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: barW, background: color }} />
        </div>
        <span className="text-[10px] font-semibold shrink-0" style={{ color }}>
          {score}
        </span>
      </div>

      {show && reasons.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-ink-900 text-white text-xs rounded-xl p-3 shadow-panel z-20 leading-relaxed">
          <p className="font-semibold mb-1.5 flex items-center gap-1" style={{ color }}>
            <Activity size={11} /> Health: {label} ({score}/100)
          </p>
          <ul className="space-y-1">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-red-300">
                <span className="mt-0.5">↓</span><span>{r}</span>
              </li>
            ))}
          </ul>
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-ink-900 rotate-45" />
        </div>
      )}
    </div>
  );
}

// ─── Donut Progress ──────────────────────────────────────
function DonutProgress({ percent, color, size = 26 }) {
  const r = 10, circ = 2 * Math.PI * r;
  const filled = (percent / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className="shrink-0">
      <circle cx="14" cy="14" r={r} fill="none" stroke="#e4e7f0" strokeWidth="3.5" />
      <circle cx="14" cy="14" r={r} fill="none" stroke={color} strokeWidth="3.5"
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 14 14)" style={{ transition: 'stroke-dasharray 0.4s ease' }} />
      <circle cx="14" cy="14" r="2" fill={percent === 100 ? color : '#e4e7f0'} />
    </svg>
  );
}

// ─── AT RISK Badge ───────────────────────────────────────
function getRiskInfo(project, allTasks) {
  const pt       = allTasks.filter(t => t.project === project._id || t.project?._id === project._id);
  const total    = pt.length;
  const done     = pt.filter(t => t.status === 'done').length;
  const pending  = pt.filter(t => t.status !== 'done');
  const highPend = pending.filter(t => t.priority === 'high' || t.priority === 'critical');
  const overdue  = pending.filter(t => t.dueDate && isPast(new Date(t.dueDate)));
  const dueDates = pt.filter(t => t.dueDate).map(t => new Date(t.dueDate));
  const nearest  = dueDates.length > 0 ? new Date(Math.min(...dueDates)) : null;
  const daysLeft = nearest ? differenceInDays(nearest, new Date()) : null;

  const reasons = [];
  if (daysLeft !== null && daysLeft <= 3 && pending.length > 0)
    reasons.push(`Deadline in ${daysLeft <= 0 ? 'past' : daysLeft + ' day' + (daysLeft === 1 ? '' : 's')}, ${pending.length} tasks pending`);
  if (highPend.length >= 2) reasons.push(`${highPend.length} high-priority tasks pending`);
  if (overdue.length > 0)   reasons.push(`${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`);

  return {
    isAtRisk: reasons.length > 0, reasons,
    percent: total === 0 ? 0 : Math.round((done / total) * 100)
  };
}

// ─── Smart Auto-Prioritizer ──────────────────────────────
function AutoPrioritizer({ tasks, onUpdate, onClose }) {
  const [preview, setPreview]   = useState([]);
  const [applying, setApplying] = useState(false);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    const pending = tasks.filter(t => t.status !== 'done');
    const scored  = pending.map(t => {
      let score = 0;
      const now = new Date();
      if (t.dueDate) {
        const days = differenceInDays(new Date(t.dueDate), now);
        if (days < 0)  score += 100;
        else if (days <= 1) score += 80;
        else if (days <= 3) score += 60;
        else if (days <= 7) score += 40;
        else score += 10;
      } else { score += 20; }
      const priorityMap = { critical: 40, high: 30, medium: 15, low: 5 };
      score += priorityMap[t.priority] || 15;
      if (t.status === 'in-progress') score += 20;

      let newPriority;
      if (score >= 120)      newPriority = 'critical';
      else if (score >= 80)  newPriority = 'high';
      else if (score >= 40)  newPriority = 'medium';
      else                   newPriority = 'low';

      return { ...t, newPriority, changed: newPriority !== t.priority, score };
    }).sort((a, b) => b.score - a.score);

    setPreview(scored);
  }, [tasks]);

  const handleApply = async () => {
    setApplying(true);
    const changed = preview.filter(t => t.changed);
    try {
      await Promise.all(changed.map(t => onUpdate(t._id, { priority: t.newPriority })));
      toast.success(`✨ ${changed.length} tasks re-prioritized!`);
      setDone(true);
      setTimeout(onClose, 1500);
    } catch { toast.error('Failed to apply'); }
    finally { setApplying(false); }
  };

  const changedCount = preview.filter(t => t.changed).length;

  return (
    <div className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-panel w-full max-w-lg animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-brand-500" />
            </div>
            <div>
              <h2 className="font-semibold text-ink-900">Smart Auto-Prioritizer</h2>
              <p className="text-xs text-ink-400">Based on deadlines, workload & status</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700"><X size={18} /></button>
        </div>

        <div className="p-5">
          {done ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
              <p className="font-semibold text-ink-900">Done! Tasks re-prioritized.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-ink-600">
                  {changedCount > 0
                    ? <><span className="font-semibold text-brand-600">{changedCount} tasks</span> will be updated</>
                    : <span className="text-green-600">All priorities look good! ✓</span>
                  }
                </p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {preview.map(t => (
                  <div key={t._id} className={`flex items-center gap-3 p-2.5 rounded-xl border ${t.changed ? 'border-brand-100 bg-brand-50/40' : 'border-surface-100 bg-surface-50'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink-800 truncate">{t.title}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`badge text-[10px] py-0 ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                      {t.changed && (
                        <>
                          <span className="text-ink-300 text-xs">→</span>
                          <span className={`badge text-[10px] py-0 ${PRIORITY_STYLES[t.newPriority]}`}>{t.newPriority}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                <button onClick={handleApply} disabled={applying || changedCount === 0} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Sparkles size={14} />
                  {applying ? 'Applying...' : `Apply ${changedCount} Changes`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Member Modal ────────────────────────────────────
function AddMemberModal({ project, onClose, onAdded }) {
  const [allUsers, setAllUsers]         = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole]                 = useState('member');
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    api.get('/users').then(r => {
      const existingIds = project.members?.map(m => m.user?._id || m.user) || [];
      setAllUsers(r.data.filter(u => !existingIds.includes(u._id)));
    }).catch(() => toast.error('Could not load users'));
  }, [project]);

  const handleAdd = async () => {
    if (!selectedUser) return toast.error('Select a user');
    setLoading(true);
    try {
      await api.post(`/projects/${project._id}/members`, { userId: selectedUser, role });
      toast.success('Member added!'); onAdded(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-panel w-full max-w-sm animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="font-semibold text-ink-900 flex items-center gap-2">
            <UserPlus size={16} className="text-brand-500" /> Add Member
          </h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Select User</label>
            {allUsers.length === 0
              ? <p className="text-sm text-ink-400 bg-surface-50 rounded-xl p-3">No more users. Create from Admin Panel first.</p>
              : <select className="input" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                  <option value="">-- Select a user --</option>
                  {allUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Role</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button onClick={handleAdd} disabled={loading || !selectedUser} className="btn-primary flex-1">
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Task Drawer ─────────────────────────────────────────
function TaskDrawer({ task, onClose, onUpdate, onDelete, isAdmin }) {
  const [form, setForm]     = useState({ ...task });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...task }); }, [task]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(task._id, { title: form.title, description: form.description, status: form.status, priority: form.priority, dueDate: form.dueDate });
      toast.success('Saved!'); onClose();
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    await onDelete(task._id); toast.success('Deleted'); onClose();
  };

  const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';

  return (
    <>
      <div className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-panel z-50 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div className="flex items-center gap-2">
            {overdue && <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><AlertTriangle size={12} /> Overdue</span>}
            <span className={`badge ${STATUS_STYLES[task.status]}`}>{task.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDelete} className="p-1.5 text-ink-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
            <button onClick={onClose} className="p-1.5 text-ink-300 hover:text-ink-700 rounded-lg hover:bg-surface-100 transition-all"><X size={15} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <input className="w-full text-xl font-bold text-ink-900 bg-transparent border-b-2 border-transparent focus:border-brand-400 outline-none pb-1 transition-colors"
            value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea className="input resize-none text-sm" rows={3} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
              Status <span className="text-green-500 font-normal normal-case ml-1">✓ You can change this</span>
            </label>
            <select className="input text-sm" value={form.status || 'todo'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="todo">Todo</option><option value="in-progress">In Progress</option>
              <option value="review">Review</option><option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
              Priority {!isAdmin && <span className="ml-2 inline-flex items-center gap-1 text-red-400 font-normal normal-case"><Lock size={10} /> Admin only</span>}
            </label>
            {isAdmin
              ? <select className="input text-sm" value={form.priority || 'medium'} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="low">Low</option><option value="medium">Medium</option>
                  <option value="high">High</option><option value="critical">Critical</option>
                </select>
              : <div className="input text-sm bg-surface-100 text-ink-400 cursor-not-allowed flex items-center justify-between">
                  <span className="capitalize">{task.priority}</span><Lock size={13} className="text-ink-300" />
                </div>
            }
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">
              Deadline {!isAdmin && <span className="ml-2 inline-flex items-center gap-1 text-red-400 font-normal normal-case"><Lock size={10} /> Admin only</span>}
            </label>
            {isAdmin
              ? <input type="date" className="input text-sm" value={form.dueDate ? form.dueDate.substring(0, 10) : ''} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              : <div className="input text-sm bg-surface-100 text-ink-400 cursor-not-allowed flex items-center justify-between">
                  <span>{task.dueDate ? format(new Date(task.dueDate), 'dd MMM yyyy') : 'No deadline'}</span>
                  <Lock size={13} className="text-ink-300" />
                </div>
            }
          </div>
          {task.assignedTo && (
            <div>
              <label className="block text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Assigned To</label>
              <div className="flex items-center gap-2 text-sm text-ink-700">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">{task.assignedTo.name?.[0]?.toUpperCase()}</div>
                {task.assignedTo.name}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-surface-100">
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}><Icon size={20} className="text-white" /></div>
      <div><p className="text-2xl font-bold text-ink-900">{value}</p><p className="text-xs text-ink-400">{label}</p></div>
    </div>
  );
}

// ─── Drag & Drop Kanban ──────────────────────────────────
function KanbanColumn({ col, tasks, onTaskClick, onDragStart, onDragOver, onDrop, draggingId }) {
  return (
    <div className="flex flex-col min-h-0"
      onDragOver={e => { e.preventDefault(); onDragOver(col.id); }}
      onDrop={() => onDrop(col.id)}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
        <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider">{col.label}</span>
        <span className="ml-auto text-[10px] font-mono text-ink-300">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-0.5 min-h-[80px] rounded-xl transition-all">
        {tasks.map(t => {
          const overdue = t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'done';
          const isDragging = draggingId === t._id;
          return (
            <div key={t._id}
              draggable
              onDragStart={() => onDragStart(t)}
              onClick={() => onTaskClick(t)}
              className={`bg-white border border-surface-200 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-brand-300 hover:shadow-card transition-all duration-150 group select-none ${isDragging ? 'opacity-40 scale-95' : ''}`}>
              {overdue && <div className="flex items-center gap-1 text-red-500 text-[10px] font-medium mb-1.5"><AlertTriangle size={10} /> Overdue</div>}
              <p className="text-xs font-semibold text-ink-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{t.title}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className={`badge text-[10px] py-0 ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-ink-300">
                {t.assignedTo
                  ? <span className="flex items-center gap-1"><User size={9} />{t.assignedTo.name?.split(' ')[0]}</span>
                  : <span className="text-ink-200">Unassigned</span>
                }
                {t.dueDate && (
                  <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : ''}`}>
                    <Calendar size={9} />{format(new Date(t.dueDate), 'MMM d')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-surface-200 rounded-xl h-16 flex items-center justify-center text-[10px] text-ink-200 transition-colors">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────
export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { projects, loading: projLoading, fetchProjects } = useProjects();
  const { tasks, updateTask, deleteTask } = useTasks({});

  const [activeProject, setActiveProject]         = useState(null);
  const [projectTasks, setProjectTasks]            = useState([]);
  const [selectedTask, setSelectedTask]            = useState(null);
  const [showCreateProject, setShowCreateProject]  = useState(false);
  const [showCreateTask, setShowCreateTask]        = useState(false);
  const [showAddMember, setShowAddMember]          = useState(false);
  const [showAutoPriority, setShowAutoPriority]    = useState(false);
  const [activeProjectFull, setActiveProjectFull]  = useState(null);
  const [stats, setStats]   = useState({ total: 0, done: 0, inProgress: 0, overdue: 0 });

  // Drag state
  const draggingTask = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  useEffect(() => {
    api.get('/tasks/dashboard').then(r => setStats(r.data)).catch(() => {});
  }, [projectTasks.length]);

  useEffect(() => {
    if (projects.length > 0 && !activeProject) setActiveProject(projects[0]);
  }, [projects]);

  useEffect(() => {
    if (!activeProject) return;
    api.get(`/projects/${activeProject._id}`).then(r => setActiveProjectFull(r.data)).catch(() => {});
    api.get('/tasks', { params: { project: activeProject._id } }).then(r => setProjectTasks(r.data)).catch(() => {});
  }, [activeProject]);

  const refreshProjectTasks = () => {
    if (!activeProject) return;
    api.get('/tasks', { params: { project: activeProject._id } }).then(r => setProjectTasks(r.data)).catch(() => {});
    api.get('/tasks/dashboard').then(r => setStats(r.data)).catch(() => {});
  };

  const refreshProject = () => {
    if (!activeProject) return;
    api.get(`/projects/${activeProject._id}`).then(r => { setActiveProjectFull(r.data); fetchProjects(); }).catch(() => {});
  };

  const handleUpdateTask = async (id, payload) => {
    const updated = await updateTask(id, payload);
    setProjectTasks(pt => pt.map(t => t._id === id ? { ...t, ...updated } : t));
    return updated;
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setProjectTasks(pt => pt.filter(t => t._id !== id));
  };

  // ── Drag & Drop handlers ──
  const handleDragStart = (task) => {
    draggingTask.current = task;
    setDraggingId(task._id);
  };

  const handleDragOver = (colId) => {
    setDragOverCol(colId);
  };

  const handleDrop = async (newStatus) => {
    const task = draggingTask.current;
    if (!task || task.status === newStatus) {
      setDraggingId(null); setDragOverCol(null); draggingTask.current = null;
      return;
    }
    // Optimistic update
    setProjectTasks(pt => pt.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
    setDraggingId(null); setDragOverCol(null); draggingTask.current = null;

    try {
      await updateTask(task._id, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
      refreshProjectTasks();
    } catch {
      toast.error('Move failed');
      refreshProjectTasks();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">

      {/* Stats */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-ink-900">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},{' '}
              <span className="text-brand-500">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-xs text-ink-400 mt-0.5">Here's your workspace overview</p>
          </div>
          <button onClick={() => setShowCreateProject(true)} className="btn-primary flex items-center gap-1.5 text-sm py-1.5">
            <Plus size={14} /> New Project
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={BarChart3}     label="Total Tasks"  value={stats.total}      color="bg-brand-500" />
          <StatCard icon={CheckCircle2}  label="Completed"    value={stats.done}       color="bg-green-500" />
          <StatCard icon={Clock}         label="In Progress"  value={stats.inProgress} color="bg-blue-500" />
          <StatCard icon={AlertTriangle} label="Overdue"      value={stats.overdue}    color="bg-red-500" />
        </div>
      </div>

      {/* Workspace */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Projects sidebar */}
        <div className="w-60 shrink-0 flex flex-col gap-2 overflow-y-auto">
          <p className="text-xs font-semibold text-ink-300 uppercase tracking-wider px-1 mb-1">Projects</p>
          {projLoading
            ? [1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-surface-100 animate-pulse" />)
            : projects.length === 0
              ? <div className="card text-center py-8 border-2 border-dashed border-surface-200"><p className="text-xs text-ink-300">No projects yet</p></div>
              : projects.map(p => {
                  const { isAtRisk: risk, reasons, percent } = getRiskInfo(p, tasks);
                  const health = calcHealthScore(p, tasks);
                  const isActive = activeProject?._id === p._id;
                  const donutColor = health.color;

                  return (
                    <div key={p._id} onClick={() => setActiveProject(p)}
                      className={`rounded-xl p-3 cursor-pointer border transition-all duration-150 ${
                        isActive ? 'bg-white border-brand-200 shadow-card' : 'bg-white border-surface-200 hover:border-brand-200 hover:shadow-card'
                      }`}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <DonutProgress percent={percent} color={donutColor} size={26} />
                        <span className={`text-xs font-semibold truncate flex-1 ${isActive ? 'text-brand-600' : 'text-ink-700'}`}>{p.name}</span>
                        {isActive && <ChevronRight size={12} className="text-brand-400 shrink-0" />}
                      </div>
                      {/* Health Score bar */}
                      <HealthBadge {...health} />
                    </div>
                  );
                })
          }
        </div>

        {/* Kanban */}
        <div className="flex-1 min-w-0 flex flex-col">
          {!activeProject ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Zap size={32} className="text-ink-200 mx-auto mb-3" />
                <p className="text-ink-300 text-sm">Select a project to view its board</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: activeProject.color + '20' }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: activeProject.color }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-ink-900">{activeProject.name}</h2>
                    {activeProject.description && <p className="text-xs text-ink-400 line-clamp-1">{activeProject.description}</p>}
                  </div>
                  <div className="flex -space-x-1.5 ml-2">
                    {(activeProjectFull || activeProject).members?.slice(0, 5).map(m => (
                      <div key={m.user?._id || m.user} title={m.user?.name || ''}
                        className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-brand-600">
                        {m.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Auto-Prioritizer button */}
                  <button onClick={() => setShowAutoPriority(true)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all">
                    <Sparkles size={13} /> Auto-Prioritize
                  </button>
                  {isAdmin && (
                    <button onClick={() => setShowAddMember(true)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-surface-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-600 transition-all">
                      <UserPlus size={13} /> Add Member
                    </button>
                  )}
                  <button onClick={() => setShowCreateTask(true)} className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3">
                    <Plus size={13} /> Add Task
                  </button>
                </div>
              </div>

              {/* Kanban grid */}
              <div className="grid grid-cols-4 gap-3 flex-1 overflow-hidden">
                {STATUS_COLS.map(col => (
                  <KanbanColumn
                    key={col.id}
                    col={col}
                    tasks={projectTasks.filter(t => t.status === col.id)}
                    onTaskClick={setSelectedTask}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    draggingId={draggingId}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      {selectedTask && (
        <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask} onDelete={handleDeleteTask} isAdmin={isAdmin} />
      )}
      {showAutoPriority && (
        <AutoPrioritizer
          tasks={projectTasks}
          onUpdate={handleUpdateTask}
          onClose={() => { setShowAutoPriority(false); refreshProjectTasks(); }}
        />
      )}
      {showCreateProject && <CreateProjectModal onClose={() => setShowCreateProject(false)} />}
      {showCreateTask && activeProject && (
        <CreateTaskModal projectId={activeProject._id}
          onClose={() => { setShowCreateTask(false); refreshProjectTasks(); }} />
      )}
      {showAddMember && activeProjectFull && (
        <AddMemberModal project={activeProjectFull}
          onClose={() => setShowAddMember(false)} onAdded={refreshProject} />
      )}
    </div>
  );
}