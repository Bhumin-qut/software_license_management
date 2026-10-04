import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Alert, PageHeader, SearchBox } from '../components/ui';

export default function AvailableSoftware() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/software').then(setItems).catch((err) => setError(err.message));
  }, []);

  const visible = items.filter((item) => item.software_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <PageHeader title="Available Software" />
      <Alert>{error}</Alert>
      <SearchBox value={query} onChange={setQuery} placeholder="Search software by name or category..." />
      <div className="catalog-grid">
        {visible.map((item) => (
          <article className="soft-card" key={item._id}>
            <h2>{item.software_name}</h2>
            <div className="ver">Version: {item.latest_version?.version_number || 'Not published'}</div>
            <p>{item.latest_version?.release_notes || 'A published version is not available yet.'}</p>
            {item.latest_version ? (
              <Link className="btn btn-primary btn-block" to={`/software/${item._id}/request`}>Request License</Link>
            ) : (
              <button className="btn btn-primary btn-block" type="button" disabled>Request License</button>
            )}
          </article>
        ))}
      </div>
      {!error && visible.length === 0 ? <p className="empty">No software matches your search.</p> : null}
    </section>
  );
}
