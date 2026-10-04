import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Alert } from '../components/ui';

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
    <section className="auth-card">
      {step === 'email' ? (
        <form onSubmit={findAccount}>
          <h2>Reset Password</h2>
          <p className="subtitle">We will send you a reset link</p>
          <Alert>{error}</Alert>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>Send Reset Link</button>
        </form>
      ) : null}
      {step === 'password' ? (
        <form onSubmit={savePassword}>
          <h2>Reset Password</h2>
          <p className="subtitle">Choose a new password for {email}</p>
          <Alert>{error}</Alert>
          <div className="field">
            <label htmlFor="password">New Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm Password</label>
            <input id="confirm" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
          </div>
          <p className="hint">Must be at least 8 characters with a mix of letters and numbers.</p>
          <button className="btn btn-primary btn-block" type="submit" disabled={busy} style={{ marginTop: 16 }}>Update Password</button>
        </form>
      ) : null}
      {step === 'done' ? (
        <div className="auth-body">
          <h2>Reset Password</h2>
          <Alert type="success">{success}</Alert>
        </div>
      ) : null}
      <div className="auth-foot"><Link to="/login">Back to Sign In</Link></div>
    </section>
  );
}
