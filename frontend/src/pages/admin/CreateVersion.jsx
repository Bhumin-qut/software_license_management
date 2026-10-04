import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { Alert } from '../../components/ui';

export default function CreateVersion() {
  const navigate = useNavigate();
  const [software, setSoftware] = useState([]);
  const [form, setForm] = useState({ software: '', version_number: '', release_date: '', release_notes: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/api/software').then(setSoftware).catch((err) => setError(err.message));
  }, []);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/versions', { method: 'POST', body: form });
      navigate('/admin/versions', { state: { message: 'Version published.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="center-wrap">
      <form className="panel centered wide" onSubmit={onSubmit}>
        <h2>Create Version Release</h2>
        <p className="subtitle">Fill in release details to publish a new software version</p>
        <Alert>{error}</Alert>
        <div className="field">
          <label htmlFor="software">Software <span className="req">*</span></label>
          <select id="software" name="software" value={form.software} onChange={update} required>
            <option value="">Select software repository or package...</option>
            {software.map((item) => <option key={item._id} value={item._id}>{item.software_name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="version_number">Version <span className="req">*</span></label>
          <input id="version_number" name="version_number" placeholder="e.g. v2.4.0 or v3.1.2-rc" value={form.version_number} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="release_date">Target Release Date <span className="req">*</span></label>
          <input id="release_date" name="release_date" type="date" value={form.release_date} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="release_notes">Release Notes / Changelog <span className="req">*</span></label>
          <textarea id="release_notes" name="release_notes" placeholder="Document changelog summary, architectural patches, and upgrade guidance..." value={form.release_notes} onChange={update} required />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? 'Publishing...' : 'Publish Version'}</button>
      </form>
    </div>
  );
}
