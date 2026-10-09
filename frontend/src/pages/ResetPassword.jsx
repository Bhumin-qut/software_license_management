import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Message } from '../components/ui';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function ResetPassword() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  async function findAccount(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email } });
      setStep('password');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await api('/api/auth/forgot-password', {
        method: 'POST',
        body: { email, new_password: password, confirm_password: confirm },
      });
      setSuccess(result.message);
      setStep('done');
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
            <h2 className="h3 text-center text-primary">Reset Password</h2>
            {step === 'email' ? (
              <Form onSubmit={findAccount}>
                <p className="text-center text-secondary">We will send you a reset link</p>
                <Message>{error}</Message>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </Form.Group>
                <Button type="submit" className="w-100" disabled={busy}>Send Reset Link</Button>
              </Form>
            ) : null}
            {step === 'password' ? (
              <Form onSubmit={savePassword}>
                <p className="text-center text-secondary">Choose a new password for {email}</p>
                <Message>{error}</Message>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirm">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
                  <Form.Text className="text-secondary">Must be at least 8 characters with a mix of letters and numbers.</Form.Text>
                </Form.Group>
                <Button type="submit" className="w-100" disabled={busy}>Update Password</Button>
              </Form>
            ) : null}
            {step === 'done' ? <Message type="success">{success}</Message> : null}
          </Card.Body>
          <Card.Footer className="text-center bg-light">
            <Link to="/login">Back to Sign In</Link>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}
