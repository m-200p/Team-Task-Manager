import { useState } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#64748b'];

export default function CreateProjectModal({ onClose }) {
  const { createProject } = useProjectStore();
  const [form, setForm] = useState({ name: '', description: '', color: COLORS[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Project name is required');
    setLoading(true);
    try {
      await createProject(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-panel w-full max-w-sm animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="font-semibold text-ink-900">New Project</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Project Name *</label>
            <input className="input" placeholder="e.g. Website Redesign" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Description</label>
            <textarea className="input resize-none" rows={2} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-7 h-7 rounded-full transition-all duration-150 focus:outline-none"
                  style={{ background: c, boxShadow: form.color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : undefined }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
