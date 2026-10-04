import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Alert, SearchBox } from '../../components/ui';
import { formatDate } from '../../utils/format';

export default function SoftwareInventory() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  function load() {
    api('/api/software').then(setItems).catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setMode('add');
    setSelected(null);
    setName('');
    setError('');
  }

  function openEdit(item) {
    setMode('edit');
    setSelected(item);
    setName(item.software_name);
    setError('');
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'add') await api('/api/software', { method: 'POST', body: { software_name: name } });
      else await api(`/api/software/${selected._id}`, { method: 'PUT', body: { software_name: name } });
      setSuccess(mode === 'add' ? 'Software added.' : 'Software updated.');
      setMode(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete ${item.software_name}?`)) return;
    setError('');
    try {
      await api(`/api/software/${item._id}`, { method: 'DELETE' });
      setSuccess('Software removed.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = items.filter((item) => item.software_name.toLowerCase().includes(query.toLowerCase()));

  if (mode) {
    return (
      <div className="center-wrap">
        <form className="panel" onSubmit={save}>
          <div className="panel-head">
            <h2>{mode === 'add' ? 'Add New Software' : 'Edit Software'}</h2>
            <button className="icon-btn" type="button" onClick={() => setMode(null)} aria-label="Close">×</button>
          </div>
          <Alert>{error}</Alert>
          <div className="field">
            <label htmlFor="software_name">Software Name {mode === 'add' ? <span className="req">*</span> : null}</label>
            <input id="software_name" placeholder="e.g. CodeSphere Studio Enterprise" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="form-actions">
            <button className="btn btn-muted" type="button" onClick={() => setMode(null)}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={busy}>{mode === 'add' ? 'Save Software' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <section className="data-card">
      <div className="card-pad">
        <div className="card-title">
          <h1>Software License Inventory</h1>
          <button className="btn btn-primary btn-sm" type="button" onClick={openAdd}>+ ADD NEW SOFTWARE</button>
        </div>
        <Alert type="success">{success}</Alert>
        <Alert>{error}</Alert>
        <SearchBox value={query} onChange={setQuery} placeholder="Filter by package name, SKU, or publisher..." />
      </div>
      <table>
        <thead>
          <tr>
            <th>REF #</th>
            <th>SOFTWARE NAME</th>
            <th>CREATED DATE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item._id}>
              <td>{String(items.indexOf(item) + 1).padStart(3, '0')}</td>
              <td className="strong">{item.software_name}</td>
              <td>{formatDate(item.created_at)}</td>
              <td>
                <div className="actions">
                  <button className="btn btn-muted btn-sm" type="button" onClick={() => openEdit(item)}>EDIT</button>
                  <button className="btn btn-danger btn-sm" type="button" onClick={() => remove(item)}>DELETE</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length === 0 ? <p className="empty">No software matches your search.</p> : null}
    </section>
  );
}
