import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { Message } from '../components/ui';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

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
    <Row className="justify-content-center">
      <Col lg={7}>
        <Card>
          <Card.Body className="p-4">
            <h2 className="h3 text-center text-primary mb-4">Submit Version Feedback</h2>
            <Form onSubmit={onSubmit}>
              <Message>{error}</Message>
              <Form.Group className="mb-3">
                <Form.Label>Software & Version</Form.Label>
                {preset ? <div className="fw-semibold">{presetName}</div> : (
                  <Form.Select value={version} onChange={(event) => setVersion(event.target.value)} required>
                    <option value="">Select software and version...</option>
                    {versions.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.software?.software_name} {item.version_number}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating Score (1-5)</Form.Label>
                <Form.Select value={rating} onChange={(event) => setRating(event.target.value)} required>
                  <option value="">Select score ranking...</option>
                  {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="comments">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Please describe what worked well or issues encountered with this software build..."
                  value={comments}
                  onChange={(event) => setComments(event.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={busy}>{busy ? 'Submitting...' : 'SUBMIT FEEDBACK'}</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
