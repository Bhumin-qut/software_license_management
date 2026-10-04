import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Alert } from '../components/ui';

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
    <section className="auth-card">
      <form onSubmit={onSubmit}>
        <h2>Create Account</h2>
        <p className="subtitle">Join License Manager</p>
        <Alert>{error}</Alert>
        <div className="field">
          <label htmlFor="full_name">Full Name</label>
          <input id="full_name" name="full_name" placeholder="Jane Doe" value={form.full_name} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="name@company.com" value={form.email} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Create a password" value={form.password} onChange={update} required />
        </div>
        <div className="field">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input id="confirm_password" name="confirm_password" type="password" placeholder="Repeat your password" value={form.confirm_password} onChange={update} required />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? 'Creating account...' : 'Register'}</button>
      </form>
      <div className="auth-foot">Already have an account? <Link to="/login">Sign In here</Link></div>
    </section>
  );
}
