import { useEffect, useState } from 'react';
import { api } from '../api';
import { Alert, PageHeader } from '../components/ui';
import { formatNotificationTime } from '../utils/format';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/notifications').then(setItems).catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <PageHeader title="Notifications" />
      <Alert>{error}</Alert>
      {items.map((item) => (
        <article className="note" key={item._id}>
          <p><span className="k">MESSAGE:</span> {item.message}</p>
          <p className="meta"><span className="k">CREATED AT:</span> {formatNotificationTime(item.created_at)}</p>
        </article>
      ))}
      {items.length === 0 && !error ? <p className="empty">No notifications yet.</p> : null}
    </section>
  );
}
