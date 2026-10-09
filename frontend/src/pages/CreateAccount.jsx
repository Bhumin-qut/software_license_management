import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Message } from '../components/ui';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function CreateAccount() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/software', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={7} lg={5}>
        <Card>
          <Card.Body className="p-4">
            <h2 className="h3 text-center text-primary">Create Account</h2>
            <p className="text-center text-secondary">Join License Manager</p>
            <Form onSubmit={onSubmit}>
              <Message>{error}</Message>
              <Form.Group className="mb-3" controlId="full_name">
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="full_name" placeholder="Jane Doe" value={form.full_name} onChange={update} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control name="email" type="email" placeholder="name@company.com" value={form.email} onChange={update} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Create a password" value={form.password} onChange={update} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirm_password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control name="confirm_password" type="password" placeholder="Repeat your password" value={form.confirm_password} onChange={update} required />
              </Form.Group>
              <Button type="submit" className="w-100" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</Button>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center text-secondary bg-light">
            Already have an account? <Link to="/login">Sign In here</Link>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}
