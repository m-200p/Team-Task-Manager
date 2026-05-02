const PRIORITY = {
  low:      'bg-surface-100 text-ink-400',
  medium:   'bg-amber-50 text-amber-600',
  high:     'bg-orange-50 text-orange-600',
  critical: 'bg-red-50 text-red-600'
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${PRIORITY[priority] || PRIORITY.medium}`}>
      {priority}
    </span>
  );
}