import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../api';
import { Alert, PageHeader, SearchBox } from '../../components/ui';
import { formatDate } from '../../utils/format';

export default function VersionList() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  function load() {
    api('/api/versions').then(setItems).catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  async function remove(item) {
    if (!window.confirm(`Delete ${item.version_number}?`)) return;
    setError('');
    try {
      await api(`/api/versions/${item._id}`, { method: 'DELETE' });
      setSuccess('Version deleted.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = items.filter((item) => {
    const haystack = [item.software?.software_name, item.version_number, item.release_notes].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <section>
      <PageHeader title="Published Versions" action={<Link className="btn btn-primary" to="/admin/versions/new">+ Add Version</Link>} />
      <Alert type="success">{success}</Alert>
      <Alert>{error}</Alert>
      <div className="data-card">
        <div className="card-pad">
          <SearchBox label="SEARCH:" value={query} onChange={setQuery} placeholder="Search by software name, version, or release notes..." />
        </div>
        <table>
          <thead>
            <tr>
              <th>SOFTWARE NAME</th>
              <th>VERSION</th>
              <th>RELEASE DATE</th>
              <th>RELEASE NOTES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item._id}>
                <td className="strong">{item.software?.software_name}</td>
                <td>{item.version_number}</td>
                <td>{formatDate(item.release_date)}</td>
                <td className="notes">{item.release_notes}</td>
                <td><div className="actions"><button className="btn btn-danger btn-sm" type="button" onClick={() => remove(item)}>Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? <p className="empty">No versions match your search.</p> : null}
      </div>
    </section>
  );
}
