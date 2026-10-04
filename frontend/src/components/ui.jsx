export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export function SearchBox({ label, value, onChange, placeholder }) {
  return (
    <label className={label ? 'search-inline' : 'search-box'}>
      {label ? <span>{label}</span> : null}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

const badgeClass = {
  Active: 'badge-green',
  ACTIVE: 'badge-green',
  Approved: 'badge-green',
  APPROVED: 'badge-green',
  Pending: 'badge-amber',
  PENDING: 'badge-amber',
  Rejected: 'badge-red',
  REJECTED: 'badge-red',
  Expired: 'badge-gray',
  EXPIRED: 'badge-gray',
  BLOCKED: 'badge-red',
  Blocked: 'badge-red',
};

export function StatusBadge({ value }) {
  return <span className={`badge ${badgeClass[value] || 'badge-gray'}`}>{value}</span>;
}
