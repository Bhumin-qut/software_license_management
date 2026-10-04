import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';
import { Alert } from '../components/ui';
import { formatSubmitted } from '../utils/format';

export default function PastFeedback() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const success = location.state?.message || '';

  useEffect(() => {
    api('/api/feedback/mine').then(setItems).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="center-wrap">
      <section className="panel wide" style={{ width: 'min(760px, 100%)' }}>
        <div className="card-title">
          <h2 style={{ color: '#2563eb' }}>My Past Feedback</h2>
          <Link className="btn btn-primary btn-sm" to="/feedback/new">Add Feedback</Link>
        </div>
        <Alert type="success">{success}</Alert>
        <Alert>{error}</Alert>
        {items.map((item) => (
          <article className="feedback-item" key={item._id}>
            <div className="feedback-top">
              <div>
                <div className="strong">{item.version?.software?.software_name}</div>
                <div className="score-row">
                  <span>{item.version?.version_number}</span>
                  <span className="badge badge-blue">Score: {item.rating}/5</span>
                </div>
              </div>
              <div className="secondary">{formatSubmitted(item.created_at)}</div>
            </div>
            <p>{item.comments}</p>
          </article>
        ))}
        {items.length === 0 && !error ? <p className="empty">You have not submitted feedback yet.</p> : null}
      </section>
    </div>
  );
}
