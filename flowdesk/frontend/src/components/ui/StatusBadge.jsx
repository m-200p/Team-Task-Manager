const STATUS = {
  'todo':        'bg-surface-100 text-ink-400',
  'in-progress': 'bg-blue-50 text-blue-600',
  'review':      'bg-purple-50 text-purple-600',
  'done':        'bg-green-50 text-green-600'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS[status] || STATUS.todo}`}>
      {status}
    </span>
  );
}