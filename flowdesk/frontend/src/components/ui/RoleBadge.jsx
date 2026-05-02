export default function RoleBadge({ role }) {
  const styles = {
    admin:  'bg-brand-50 text-brand-600',
    member: 'bg-surface-100 text-ink-500'
  };
  return (
    <span className={`badge ${styles[role] || styles.member}`}>
      {role}
    </span>
  );
}