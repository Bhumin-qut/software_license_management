import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { Alert } from '../components/ui';

export default function LicenseRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [software, setSoftware] = useState(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/api/software/${id}`).then(setSoftware).catch((err) => setError(err.message));
  }, [id]);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/licenses', {
        method: 'POST',
        body: {
          assigned_software: software._id,
          version_number: software.latest_version?._id,
          reason,
        },
      });
      navigate('/licenses', { state: { message: 'License request submitted.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="center-wrap">
      <form className="panel centered wide" onSubmit={onSubmit}>
        <h2>New Software License Request</h2>
        <div style={{ height: 18 }} />
        <Alert>{error}</Alert>
        {!software ? <p className="empty">Loading software...</p> : null}
        {software ? (
          <>
            <div className="field">
              <div className="label">Software Title</div>
              <div className="static-value">{software.software_name}</div>
            </div>
            <div className="field">
              <div className="label">Preferred Version</div>
              <div className="static-value">{software.latest_version?.version_number || '—'}</div>
            </div>
            <div className="field">
              <div className="field-label-row">
                <label htmlFor="reason">Business Reason / Justification</label>
                <span className="count">{reason.length} / 500</span>
              </div>
              <textarea
                id="reason"
                maxLength={500}
                placeholder="Please explain your project requirement and why this software license is needed..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={busy || !software.latest_version}>
              {busy ? 'Submitting...' : 'Submit License Request'}
            </button>
          </>
        ) : null}
      </form>
    </div>
  );
}
