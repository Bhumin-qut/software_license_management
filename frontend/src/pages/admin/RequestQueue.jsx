import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Alert, SearchBox, StatusBadge } from '../../components/ui';
import { formatLongDate } from '../../utils/format';

export default function RequestQueue() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function load() {
    api('/api/licenses').then(setItems).catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    setError('');
    try {
      await api(`/api/licenses/${id}/status`, { method: 'PATCH', body: { status } });
      setSuccess('Request updated.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this license request?')) return;
    setError('');
    try {
      await api(`/api/licenses/${id}`, { method: 'DELETE' });
      setSuccess('Request deleted.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = items.filter((item) => {
    const haystack = [item.user?.full_name, item.user?.email, item.assigned_software?.software_name].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <section className="data-card">
      <div className="card-pad">
        <div className="card-title"><h1>License Requests Queue</h1></div>
        <Alert type="success">{success}</Alert>
        <Alert>{error}</Alert>
        <SearchBox value={query} onChange={setQuery} placeholder="Filter by applicant, email, or software package..." />
      </div>
      <table>
        <thead>
          <tr>
            <th>APPLICANT & EMAIL</th>
            <th>SOFTWARE PACKAGE</th>
            <th>VERSION</th>
            <th>REQUEST DATE</th>
            <th>JUSTIFICATION AUDIT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="strong">{item.user?.full_name}</div>
                <div className="secondary">{item.user?.email}</div>
              </td>
              <td className="strong">{item.assigned_software?.software_name}</td>
              <td>{item.version_number?.version_number || '—'}</td>
              <td>{formatLongDate(item.requested_at)}</td>
              <td className="notes">{item.reason}</td>
              <td><StatusBadge value={item.status.toUpperCase()} /></td>
              <td>
                <div className="actions">
                  {item.status === 'Pending' ? (
                    <>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => setStatus(item._id, 'Approved')}>APPROVE</button>
                      <button className="btn btn-muted btn-sm" type="button" onClick={() => setStatus(item._id, 'Rejected')}>REJECT</button>
                    </>
                  ) : null}
                  {item.status === 'Approved' ? (
                    <button className="btn btn-muted btn-sm" type="button" onClick={() => setStatus(item._id, 'Expired')}>REVOKE</button>
                  ) : null}
                  <button className="btn btn-danger btn-sm" type="button" onClick={() => remove(item._id)}>DELETE</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length === 0 ? <p className="empty">No requests match your search.</p> : null}
    </section>
  );
}
