import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { backendApi } from '../../services/backendApi';
import {
  FaUserShield,
  FaUserEdit,
  FaUserSlash,
  FaUserCheck,
  FaUserPlus,
  FaTrash,
} from 'react-icons/fa';
import UserInviteModal from './UserInviteModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await backendApi.users.list();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await backendApi.users.updateRole(id, newRole);
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      const newStatus = !currentStatus;
      await backendApi.users.updateStatus(id, newStatus);
      setUsers(users.map((u) => (u.id === id ? { ...u, is_active: newStatus } : u)));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUserInvited = (newUser) => {
    setUsers([newUser, ...users]);
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setUpdatingId(user.id);
    try {
      await backendApi.users.delete(user.id);
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="brand"
              onClick={() => setIsInviteModalOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <FaUserPlus />
              Invite User
            </Button>
            <Button variant="outline" onClick={fetchUsers} size="sm">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="py-3 px-4 font-semibold text-sm">User</th>
                  <th className="py-3 px-4 font-semibold text-sm">Role</th>
                  <th className="py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="py-3 px-4 font-semibold text-sm">Joined</th>
                  <th className="py-3 px-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className="text-xs p-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="moderator">Moderator</option>
                        <option value="viewer">Viewer</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(user.id, user.is_active)}
                          disabled={updatingId === user.id}
                          className={user.is_active ? 'text-red-500' : 'text-green-500'}
                        >
                          {
                            user.is_active ? (
                              <FaUserSlash title="Disable" />
                            ) : (
                              <FaUserCheck title="Enable" />
                            ) /* Use direct Ternary to avoid confusion */
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          disabled={updatingId === user.id}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <FaTrash title="Delete User" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UserInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onUserInvited={handleUserInvited}
      />
    </div>
  );
}
