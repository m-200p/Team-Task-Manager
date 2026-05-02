import { FolderKanban, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="card cursor-pointer hover:shadow-panel hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: project.color + '20' }}>
          <FolderKanban size={20} style={{ color: project.color }} />
        </div>
        <ChevronRight size={16} className="text-ink-200 group-hover:text-brand-500 transition-colors mt-1" />
      </div>

      <h3 className="font-semibold text-ink-900 mb-1 group-hover:text-brand-600 transition-colors">{project.name}</h3>
      {project.description && (
        <p className="text-xs text-ink-400 mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center justify-between text-xs text-ink-300 mt-auto">
        <span className="flex items-center gap-1">
          <Users size={11} />
          {project.members?.length || 1} member{project.members?.length !== 1 ? 's' : ''}
        </span>
        <span>{format(new Date(project.createdAt), 'MMM d')}</span>
      </div>
    </div>
  );
}