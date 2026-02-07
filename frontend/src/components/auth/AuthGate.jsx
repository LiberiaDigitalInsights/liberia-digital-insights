import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Muted } from '../ui/Typography';
import { useAuth } from '../../context/AuthContext';

export default function AuthGate({ children, requiredRole = 'admin' }) {
  const { user, login, loading: authLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Check authentication and role
  if (isAuthenticated) {
    // Basic admin panel access roles
    const adminPanelRoles = ['admin', 'editor', 'moderator', 'viewer'];
    const hasRole =
      !requiredRole ||
      user.role === requiredRole ||
      user.role === 'admin' ||
      (requiredRole === 'editor' && adminPanelRoles.includes(user.role));

    // Improved logic: If user is admin, always allow.
    // Otherwise, if they have the specific role OR if the required role is a basic admin role and they have one.
    const isAuthorized =
      user.role === 'admin' ||
      user.role === requiredRole ||
      (requiredRole === 'admin' && adminPanelRoles.includes(user.role)); // Allow any admin role to access the basic /admin gate

    if (isAuthorized) {
      return children;
    } else {
      return (
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You do not have the required permissions to access this page.</p>
              <Muted>Required role: {requiredRole}</Muted>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Admin Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error ? <div className="text-sm text-red-500">{error}</div> : null}
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Muted className="block pt-2 text-center text-xs">
              Secure administration access for Liberia Digital Insights.
            </Muted>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
