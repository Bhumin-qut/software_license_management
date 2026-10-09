import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';
import { Message } from '../components/ui';
import { formatSubmitted } from '../utils/format';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

export default function PastFeedback() {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const success = location.state?.message || '';

  useEffect(() => {
    api('/api/feedback/mine').then(setItems).catch((err) => setError(err.message));
  }, []);

  return (
    <Row className="justify-content-center">
      <Col lg={8}>
        <Card>
          <Card.Body>
            <Stack direction="horizontal" className="justify-content-between mb-3 flex-wrap" gap={2}>
              <h2 className="h4 text-primary mb-0">My Past Feedback</h2>
              <Button as={Link} to="/feedback/new" size="sm">Add Feedback</Button>
            </Stack>
            <Message type="success">{success}</Message>
            <Message>{error}</Message>
            {items.map((item) => (
              <article className="border-top py-3" key={item._id}>
                <Stack direction="horizontal" className="justify-content-between align-items-start flex-wrap" gap={2}>
                  <div>
                    <div className="fw-semibold">{item.version?.software?.software_name}</div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span>{item.version?.version_number}</span>
                      <Badge bg="primary">Score: {item.rating}/5</Badge>
                    </div>
                  </div>
                  <div className="text-secondary small">{formatSubmitted(item.created_at)}</div>
                </Stack>
                <p className="text-secondary mt-2 mb-0">{item.comments}</p>
              </article>
            ))}
            {items.length === 0 && !error ? <p className="text-center text-secondary py-4 mb-0">You have not submitted feedback yet.</p> : null}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
