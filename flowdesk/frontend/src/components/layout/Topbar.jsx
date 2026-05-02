import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { user, isAdmin } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-surface-200 flex items-center px-5 gap-4 shrink-0">
      <button onClick={onMenuClick} className="text-ink-400 hover:text-ink-900 transition-colors">
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {isAdmin && (
        <span className="badge bg-brand-50 text-brand-600">Admin</span>
      )}

      <button className="relative text-ink-400 hover:text-ink-900 transition-colors">
        <Bell size={18} />
      </button>

      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold">
        {user?.name?.[0]?.toUpperCase()}
      </div>
    </header>
  );
}