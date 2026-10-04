import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const userLinks = [
  { to: '/software', label: 'Available Software' },
  { to: '/licenses', label: 'My License History' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/software', label: 'Software Catalog' },
  { to: '/admin/versions', label: 'Version Releases' },
  { to: '/admin/users', label: 'User Directory' },
  { to: '/admin/requests', label: 'Request Queue' },
  { to: '/notifications', label: 'Notifications' },
];

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="page-loading">Loading...</div>;

  const links = user ? (user.role === 'admin' ? adminLinks : userLinks) : [];

  return (
    <div className="app-frame">
      <header className="topbar">
        <Link to="/" className="brand">License Manager</Link>
        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <button
              className="nav-button"
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-button">Sign In</Link>
              <Link to="/register" className="btn btn-outline btn-sm">Create Account</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <div className="shell">
          <Outlet />
        </div>
      </main>
      <footer className="footer">License Manager © {new Date().getFullYear()}. All rights reserved.</footer>
    </div>
  );
}
