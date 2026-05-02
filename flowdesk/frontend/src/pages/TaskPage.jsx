import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import StatusBadge from '../components/ui/StatusBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import api from '../services/api';
import { format } from 'date-fns';

export default function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTask, deleteTask } = useTaskStore();
  const [task, setTask]     = useState(null);
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    api.get('/tasks', { params: {} })
      .then(r => {
        const found = r.data.find(t => t._id === id);
        if (found) { setTask(found); setForm(found); }
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateTask(id, {
        title: form.title, description: form.description,
        status: form.status, priority: form.priority, dueDate: form.dueDate
      });
      setTask(updated);
      setMsg('Saved!');
      setTimeout(() => setMsg(''), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    await deleteTask(id);
    navigate(-1);
  };

  if (!task) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-ink-400 hover:text-ink-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <input
            className="text-xl font-bold text-ink-900 flex-1 bg-transparent border-b-2 border-transparent focus:border-brand-400 outline-none pb-1 transition-colors"
            value={form.title || ''}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <button onClick={handleDelete} className="btn-danger p-2 shrink-0">
            <Trash2 size={16} />
          </button>
        </div>

        <textarea
          className="input resize-none w-full"
          rows={4}
          placeholder="Add a description..."
          value={form.description || ''}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Status</label>
            <select className="input" value={form.status || 'todo'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Priority</label>
            <select className="input" value={form.priority || 'medium'} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-ink-500 mb-1">Due Date</label>
          <input type="date" className="input" value={form.dueDate ? form.dueDate.substring(0, 10) : ''}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
        </div>

        {task.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
              {task.assignedTo.name?.[0]?.toUpperCase()}
            </div>
            Assigned to <strong>{task.assignedTo.name}</strong>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-ink-300">
            Created {task.createdAt ? format(new Date(task.createdAt), 'MMM d, yyyy') : ''}
          </p>
          <div className="flex items-center gap-2">
            {msg && <span className="text-xs text-green-600 font-medium">{msg}</span>}
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-1.5 text-sm">
              <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}