import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { backendApi } from '../../services/backendApi';
import { FaTimes, FaEnvelope, FaUserTag } from 'react-icons/fa';

export default function UserInviteModal({ isOpen, onClose, onUserInvited }) {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'editor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newUser = await backendApi.users.create(formData);
      onUserInvited(newUser);
      onClose();
      // Reset form
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'editor',
      });
    } catch (err) {
      setError(err.message || 'Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
        <Card className="shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-border)]">
            <CardTitle className="text-xl flex items-center gap-2">
              <FaEnvelope className="text-brand-500" />
              Invite New User
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-muted)] transition-colors"
            >
              <FaTimes className="text-[var(--color-text-muted)]" />
            </button>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="first_name"
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                  >
                    First Name
                  </label>
                  <Input
                    id="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="last_name"
                    className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                  >
                    Last Name
                  </label>
                  <Input
                    id="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="role"
                  className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
                >
                  Assign Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                  >
                    <option value="admin">Admin (Full Access)</option>
                    <option value="editor">Editor (Content Management)</option>
                    <option value="moderator">Moderator (Reviews)</option>
                    <option value="viewer">Viewer (Read Only)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaUserTag className="text-[var(--color-text-muted)]" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Sending Invite...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
