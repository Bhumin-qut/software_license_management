import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Alert } from '../components/ui';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin/software' : '/software', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-card">
      <form onSubmit={onSubmit}>
        <h2>Sign In</h2>
        <p className="subtitle">Sign in to your account</p>
        <Alert>{error}</Alert>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div className="link-right"><Link to="/reset-password">Forgot password?</Link></div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <div className="auth-foot">Don&apos;t have an account? <Link to="/register">Register here</Link></div>
    </section>
  );
}
