import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldOff, Users, UserPlus, Trash2, Crown, User, X } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ── Add Member Modal ──────────────────────────────────────
function AddMemberModal({ onClose, onAdded }) {
  const [form, setForm]   = useState({ name: '', email: '', password: 'FlowDesk123', role: 'member' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email required');
    setLoading(true);
    try {
      await api.post('/auth/signup', form);
      toast.success(`${form.name} added!`);
      onAdded();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-panel w-full max-w-sm animate-fade-up">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="font-semibold text-ink-900 flex items-center gap-2"><UserPlus size={16} className="text-brand-500" /> Add Member</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Full Name *</label>
            <input className="input" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Email *</label>
            <input type="email" className="input" placeholder="john@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Role</label>
            <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="member">👤 Member</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1">Default Password</label>
            <input className="input bg-surface-50 text-ink-400" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <p className="text-[10px] text-ink-300 mt-1">Member can change this after login</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Adding...' : 'Add Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────
export default function AdminPanel() {
  const [users, setUsers]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [tab, setTab]           = useState('users'); // users | projects

  const fetchUsers    = () => api.get('/users').then(r => setUsers(r.data)).catch(() => {});
  const fetchProjects = () => api.get('/projects').then(r => setProjects(r.data)).catch(() => {});

  useEffect(() => {
    Promise.all([fetchUsers(), fetchProjects()]).finally(() => setLoading(false));
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers(us => us.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (userId, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers(us => us.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Delete failed — add DELETE /users/:id route'); }
  };

  const deleteProject = async (projectId, name) => {
    if (!confirm(`Delete project "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(ps => ps.filter(p => p._id !== projectId));
      toast.success('Project deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900">Admin Panel</h1>
            <p className="text-sm text-ink-400">Manage users, roles & projects</p>
          </div>
        </div>
        <button onClick={() => setShowAddMember(true)} className="btn-primary flex items-center gap-1.5 text-sm">
          <UserPlus size={15} /> Add Member
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-surface-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('users')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'users' ? 'bg-white shadow-card text-brand-600' : 'text-ink-500 hover:text-ink-700'}`}>
          Users ({users.length})
        </button>
        <button onClick={() => setTab('projects')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === 'projects' ? 'bg-white shadow-card text-brand-600' : 'text-ink-500 hover:text-ink-700'}`}>
          Projects ({projects.length})
        </button>
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-100">
            <Users size={16} className="text-ink-400" />
            <span className="font-medium text-ink-700 text-sm">All Users</span>
            <span className="ml-auto text-xs font-mono text-ink-300">{users.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{u.name}</p>
                          <p className="text-xs text-ink-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 badge ${u.role === 'admin' ? 'bg-brand-50 text-brand-600' : 'bg-surface-100 text-ink-500'}`}>
                        {u.role === 'admin'
                          ? <Crown size={11} className="text-brand-500" />
                          : <User size={11} className="text-ink-400" />
                        }
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-400 text-xs">
                      {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => toggleRole(u._id, u.role)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                            u.role === 'admin'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                          }`}>
                          {u.role === 'admin' ? <><ShieldOff size={12} /> Demote</> : <><ShieldCheck size={12} /> Promote</>}
                        </button>
                        <button onClick={() => deleteUser(u._id, u.name)}
                          className="p-1.5 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {tab === 'projects' && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-100">
            <span className="font-medium text-ink-700 text-sm">All Projects</span>
            <span className="ml-auto text-xs font-mono text-ink-300">{projects.length} total</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Project</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Members</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {projects.map(p => (
                <tr key={p._id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                      <span className="font-medium text-ink-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-ink-500 text-xs">{p.owner?.name}</td>
                  <td className="px-5 py-3.5 text-ink-400 text-xs">{p.members?.length || 0}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => deleteProject(p._id, p.name)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all ml-auto">
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdded={() => fetchUsers()}
        />
      )}
    </div>
  );
}