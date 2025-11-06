import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { H2, Muted } from '../ui/Typography';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function AuthGate({ children, requiredRole = 'admin' }) {
  const [authed, setAuthed] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [role, setRole] = React.useState('admin');

  React.useEffect(() => {
    const v = localStorage.getItem('auth_admin');
    const r = localStorage.getItem('auth_role') || 'viewer';
    const ok = v === '1' && (!requiredRole || r === requiredRole);
    setAuthed(ok);
  }, [requiredRole]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    // Simple demo gate. Replace with real auth later.
    if (username && password === 'admin') {
      localStorage.setItem('auth_admin', '1');
      localStorage.setItem('auth_role', role);
      const ok = !requiredRole || role === requiredRole;
      setAuthed(ok);
    } else {
      setError('Invalid credentials. Hint: password is "admin" for demo.');
    }
  }

  if (authed) return children;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Admin Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="mb-1 block text-sm font-medium">
                Username
              </label>
              <Input
                id="admin-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="admin-role" className="mb-1 block text-sm font-medium">
                Role
              </label>
              <select
                id="admin-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-2"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            {error ? <div className="text-sm text-red-500">{error}</div> : null}
            <Button type="submit">Sign In</Button>
            <Muted className="block pt-2">
              Demo access only. Replace with real authentication.
            </Muted>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
