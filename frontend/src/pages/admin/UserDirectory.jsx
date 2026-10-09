import { useEffect, useState } from 'react';
import { api } from '../../api';
import { Message, PageHeader, SearchBox, StatusBadge } from '../../components/ui';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';

const empty = { full_name: '', email: '', role: 'user', status: 'active' };

export default function UserDirectory() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  function load() {
    api('/api/users').then(setItems).catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setMode('add');
    setForm(empty);
    setError('');
  }

  function openEdit(user) {
    setMode('edit');
    setSelected(user);
    setForm({ full_name: user.full_name, email: user.email, role: user.role, status: user.status });
    setError('');
  }

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'add') await api('/api/users', { method: 'POST', body: form });
      else await api(`/api/users/${selected._id}`, { method: 'PUT', body: form });
      setSuccess(mode === 'add' ? 'User created. Temporary password is Password123.' : 'User updated.');
      setMode(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleStatus(user) {
    const status = user.status === 'blocked' ? 'active' : 'blocked';
    const verb = status === 'blocked' ? 'Block' : 'Unblock';
    if (!window.confirm(`${verb} ${user.full_name}?`)) return;
    setError('');
    try {
      await api(`/api/users/${user._id}/status`, { method: 'PATCH', body: { status } });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(user) {
    if (!window.confirm(`Delete ${user.full_name}?`)) return;
    setError('');
    try {
      await api(`/api/users/${user._id}`, { method: 'DELETE' });
      setSuccess('User deleted.');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const visible = items.filter((user) => `${user.full_name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));

  if (mode) {
    return (
      <Row className="justify-content-center">
        <Col lg={7}>
          <Card>
            <Card.Body className="p-4">
              <Stack direction="horizontal" className="justify-content-between mb-3">
                <h2 className="h4 mb-0">{mode === 'add' ? 'Add New User' : 'Edit User'}</h2>
                <Button variant="link" className="text-secondary fs-4 p-0" type="button" onClick={() => setMode(null)} aria-label="Close">×</Button>
              </Stack>
              <Form onSubmit={save}>
                <Message>{error}</Message>
                <Form.Group className="mb-3" controlId="full_name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control name="full_name" placeholder="e.g. John Doe" value={form.full_name} onChange={update} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control name="email" type="email" placeholder="name@company.com" value={form.email} onChange={update} required />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Select name="role" value={form.role} onChange={update}>
                        <option value="user">USER</option>
                        <option value="admin">ADMIN</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Select name="status" value={form.status} onChange={update}>
                        <option value="active">ACTIVE</option>
                        <option value="blocked">BLOCKED</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                {mode === 'add' ? <p className="text-secondary small">New users sign in with the temporary password Password123.</p> : null}
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-secondary" type="button" onClick={() => setMode(null)}>Cancel</Button>
                  <Button type="submit" disabled={busy}>{mode === 'add' ? 'Save User' : 'Save Changes'}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <section>
      <PageHeader title="User Accounts Directory" action={<Button type="button" onClick={openAdd}>Add New User</Button>} />
      <Message type="success">{success}</Message>
      <Message>{error}</Message>
      <SearchBox value={query} onChange={setQuery} placeholder="Search users by name, email, or identifier..." />
      <Card>
        <Table responsive hover className="mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th>FULL NAME</th>
              <th>EMAIL ADDRESS</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => (
              <tr key={user._id}>
                <td className="fw-semibold">{user.full_name}</td>
                <td className="text-secondary">{user.email}</td>
                <td className="fw-semibold">{user.role === 'admin' ? 'Admin' : 'User'}</td>
                <td><StatusBadge value={user.status === 'blocked' ? 'BLOCKED' : 'ACTIVE'} /></td>
                <td className="text-end text-nowrap">
                  <Button variant="outline-secondary" size="sm" className="me-2" type="button" onClick={() => openEdit(user)}>Edit</Button>
                  <Button variant={user.status === 'blocked' ? 'outline-success' : 'outline-warning'} size="sm" className="me-2" type="button" onClick={() => toggleStatus(user)}>
                    {user.status === 'blocked' ? 'Unblock' : 'Block'}
                  </Button>
                  <Button variant="outline-danger" size="sm" type="button" onClick={() => remove(user)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {visible.length === 0 ? <p className="text-center text-secondary py-4 mb-0">No users match your search.</p> : null}
      </Card>
    </section>
  );
}
