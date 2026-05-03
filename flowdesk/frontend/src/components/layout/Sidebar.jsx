import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ShieldCheck, LogOut, Zap, Sun, Moon, Camera, Key, X, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import clsx from '../../utils/clsx';
import toast from 'react-hot-toast';

const navItem = 'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150';

function ProfileModal({ onClose }) {
  const { user, updateProfile, changePassword } = useAuth();
  const [tab, setTab]             = useState('profile');
  const [avatar, setAvatar]       = useState(user?.avatar || '');
  const [name, setName]           = useState(user?.name || '');
  const [saving, setSaving]       = useState(false);
  const [oldPass, setOldPass]     = useState('');
  const [newPass, setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOld, setShowOld]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const fileRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return toast.error('Name required');
    setSaving(true);
    try {
      await updateProfile({ name, avatar });
      toast.success('Profile updated!');
      onClose();
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) return toast.error('All fields required');
    if (newPass !== confirmPass) return toast.error('Passwords do not match');
    if (newPass.length < 6) return toast.error('Min 6 characters');
    setSaving(true);
    try {
      await changePassword(oldPass, newPass);
      toast.success('Password changed!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-panel w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-surface-100">
          <h2 className="font-semibold text-ink-900">My Profile</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-ink-700"><X size={18} /></button>
        </div>

        <div className="flex border-b border-surface-100">
          {['profile', 'password'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'text-brand-600 border-b-2 border-brand-500' : 'text-ink-400 hover:text-ink-700'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'profile' ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {avatar
                    ? <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
                    : <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                  }
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white hover:bg-brand-600 transition-colors">
                    <Camera size={13} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <p className="text-xs text-ink-400">Click camera to upload (max 2MB)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1">Full Name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1">Email</label>
                <div className="input bg-surface-50 text-ink-400 cursor-not-allowed text-sm">{user?.email}</div>
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1">Current Password</label>
                <div className="relative">
                  <input type={showOld ? 'text' : 'password'} className="input pr-10" value={oldPass}
                    onChange={e => setOldPass(e.target.value)} placeholder="Current password" />
                  <button onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                    {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} className="input pr-10" value={newPass}
                    onChange={e => setNewPass(e.target.value)} placeholder="Min 6 characters" />
                  <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-500 mb-1">Confirm New Password</label>
                <input type="password" className="input" value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm new password" />
              </div>
              <button onClick={handleChangePassword} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                <Key size={14} /> {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open }) {
  const { user, logout, isAdmin } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [isDark, setIsDark]           = useState(() => localStorage.getItem('fd_theme') === 'dark');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('fd_theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!open) return null;

  return (
    <>
      <aside className="w-60 shrink-0 bg-white border-r border-surface-200 flex flex-col h-full shadow-card">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-surface-100">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-ink-900 text-lg tracking-tight">FlowDesk</span>
          <button onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}
            className="ml-auto text-ink-300 hover:text-ink-700 transition-colors p-1.5 rounded-lg hover:bg-surface-100">
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink to="/" end className={({ isActive }) =>
            clsx(navItem, isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-500 hover:bg-surface-50 hover:text-ink-900')
          }>
            <LayoutDashboard size={17} /> Dashboard
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) =>
              clsx(navItem, isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-500 hover:bg-surface-50 hover:text-ink-900')
            }>
              <ShieldCheck size={17} /> Admin Panel
            </NavLink>
          )}

          <div className="pt-4">
            <p className="px-3 pb-1.5 text-xs font-semibold text-ink-300 uppercase tracking-wider">Projects</p>
            {projects.slice(0, 8).map(p => (
              <NavLink key={p._id} to={`/projects/${p._id}`} className={({ isActive }) =>
                clsx(navItem, isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-500 hover:bg-surface-50 hover:text-ink-900')
              }>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                <span className="truncate">{p.name}</span>
                <FolderKanban size={14} className="ml-auto shrink-0 opacity-40" />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-surface-100">
          <div onClick={() => setShowProfile(true)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0 overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : user?.name?.[0]?.toUpperCase()
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{user?.name}</p>
              <p className="text-xs text-ink-300 capitalize">{user?.role}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); handleLogout(); }}
              className="ml-auto text-ink-300 hover:text-red-500 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}