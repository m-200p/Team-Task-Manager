import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ShieldCheck, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import clsx from '../../utils/clsx';

const navItem = 'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150';

export default function Sidebar({ open }) {
  const { user, logout, isAdmin } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!open) return null;

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-surface-200 flex flex-col h-full shadow-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-surface-100">
        <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-ink-900 text-lg tracking-tight">FlowDesk</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={({ isActive }) =>
          clsx(navItem, isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-500 hover:bg-surface-50 hover:text-ink-900')
        }>
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) =>
            clsx(navItem, isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-500 hover:bg-surface-50 hover:text-ink-900')
          }>
            <ShieldCheck size={17} />
            Admin Panel
          </NavLink>
        )}

        {/* Projects list */}
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
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-900 truncate">{user?.name}</p>
            <p className="text-xs text-ink-300 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="ml-auto text-ink-300 hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}