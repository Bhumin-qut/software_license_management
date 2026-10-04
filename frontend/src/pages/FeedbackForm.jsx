import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { Alert } from '../components/ui';

export default function FeedbackForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const preset = params.get('version') || '';
  const presetName = params.get('name') || '';
  const [versions, setVersions] = useState([]);
  const [version, setVersion] = useState(preset);
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (preset) return;
    api('/api/versions').then(setVersions).catch((err) => setError(err.message));
  }, [preset]);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/feedback', { method: 'POST', body: { version, rating: Number(rating), comments } });
      navigate('/feedback', { state: { message: 'Feedback submitted.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="center-wrap">
      <form className="panel centered wide" onSubmit={onSubmit}>
        <h2>Submit Version Feedback</h2>
        <div style={{ height: 16 }} />
        <Alert>{error}</Alert>
        <div className="field">
          <div className="label">Software & Version</div>
          {preset ? <div className="static-value">{presetName}</div> : (
            <select value={version} onChange={(event) => setVersion(event.target.value)} required>
              <option value="">Select software and version...</option>
              {versions.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.software?.software_name} {item.version_number}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="field">
          <label htmlFor="rating">Rating Score (1-5)</label>
          <select id="rating" value={rating} onChange={(event) => setRating(event.target.value)} required>
            <option value="">Select score ranking...</option>
            {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            placeholder="Please describe what worked well or issues encountered with this software build..."
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? 'Submitting...' : 'SUBMIT FEEDBACK'}</button>
      </form>
    </div>
  );
}
