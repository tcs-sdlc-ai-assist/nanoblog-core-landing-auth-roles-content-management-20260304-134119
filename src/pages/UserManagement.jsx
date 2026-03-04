/**
 * UserManagement.jsx
 * Admin user account management page with full CRUD capabilities.
 *
 * Features:
 *   - Create User form at top with Display Name, Username, Password, Role dropdown
 *   - Username uniqueness validation
 *   - All fields required
 *   - Responsive table (desktop) / stacked cards (mobile) of all users
 *   - Uses UserRow component for each user entry
 *   - Hard-coded admin account cannot be deleted (disabled with tooltip)
 *   - Current user cannot delete themselves
 *   - window.confirm before deletion
 *   - Real-time list updates after create/delete operations
 *
 * Route: /users (admin only, protected by ProtectedRoute)
 */

import React, { useState, useEffect } from 'react';
import { getUsers, saveUser, deleteUser } from '../utils/storage';
import { getSession } from '../utils/auth';
import UserRow from '../components/UserRow';

/**
 * Admin user management page component.
 * Provides a form to create new users and a list/table of all registered users.
 *
 * @returns {JSX.Element} The user management page
 */
export default function UserManagement() {
  const session = getSession();

  // ---- State ----
  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---- Load users on mount ----
  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Loads all users from localStorage and updates state.
   */
  function loadUsers() {
    const allUsers = getUsers();
    setUsers(allUsers);
  }

  /**
   * Clears success/error messages after a timeout.
   * @param {string} type - 'success' or 'error'
   * @param {number} [delay=3000] - Delay in milliseconds
   */
  function autoClearMessage(type, delay = 3000) {
    setTimeout(() => {
      if (type === 'success') setSuccess('');
      if (type === 'error') setError('');
    }, delay);
  }

  /**
   * Handles the create user form submission.
   * Validates inputs, checks username uniqueness, and saves the new user.
   *
   * @param {React.FormEvent} e - The form submit event
   */
  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Trim inputs
    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // --- Validation ---
    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      autoClearMessage('error');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      autoClearMessage('error');
      return;
    }

    if (trimmedPassword.length < 3) {
      setError('Password must be at least 3 characters long.');
      autoClearMessage('error');
      return;
    }

    // Check if username is the hard-coded admin username
    if (trimmedUsername === 'admin') {
      setError('Username "admin" is reserved and cannot be used.');
      autoClearMessage('error');
      return;
    }

    // Check username uniqueness against existing users
    const existingUsers = getUsers();
    const isDuplicate = existingUsers.some(
      (user) => user.username.toLowerCase() === trimmedUsername
    );

    if (isDuplicate) {
      setError(`Username "${trimmedUsername}" is already taken. Please choose another.`);
      autoClearMessage('error');
      return;
    }

    // --- Save user ---
    setIsSubmitting(true);

    const newUser = saveUser({
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
    });

    if (newUser) {
      setSuccess(`User "${trimmedDisplayName}" created successfully!`);
      autoClearMessage('success');

      // Reset form
      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('viewer');

      // Reload users list
      loadUsers();
    } else {
      setError('Failed to create user. Please try again.');
      autoClearMessage('error');
    }

    setIsSubmitting(false);
  }

  /**
   * Handles deleting a user after confirmation.
   * Prevents deletion of the hard-coded admin and the current user.
   *
   * @param {string} userId - The ID of the user to delete
   * @param {string} userDisplayName - Display name for the confirmation dialog
   */
  function handleDeleteUser(userId, userDisplayName) {
    // Safety checks (should be handled by UI, but double-check)
    if (userId === 'admin-001') return;
    if (session && userId === session.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userDisplayName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const result = deleteUser(userId);

    if (result) {
      setSuccess(`User "${userDisplayName}" has been deleted.`);
      autoClearMessage('success');
      loadUsers();
    } else {
      setError('Failed to delete user. Please try again.');
      autoClearMessage('error');
    }
  }

  // Build the combined user list: hard-coded admin + registered users
  const hardCodedAdmin = {
    id: 'admin-001',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: null, // Built-in account
    isHardCoded: true,
  };

  const allUsersWithAdmin = [hardCodedAdmin, ...users];

  return (
    <div className="page-container animate-fade-in">
      {/* ---- Page Header ---- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">
          Create, view, and manage user accounts. All users are stored locally in your browser.
        </p>
      </div>

      {/* ---- Create User Form ---- */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-primary-600"
          >
            <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
          </svg>
          Create New User
        </h2>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-slide-down">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm animate-slide-down">
            {success}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
                required
                maxLength={50}
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="input-field"
                required
                maxLength={30}
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
                maxLength={50}
                autoComplete="new-password"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
                required
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1.5"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000One5v-4.5z" />
                  </svg>
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* O--- Users List Section O--- */}
      <div className="card overflowOhidden">
        <div className="pxO6 py-4 borderOb border-gray-100 flex items-center justify-between">
          <h2 className="textOxl font-semibold textOgray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-primary-600"
            >
              <path d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A18.034 18.034 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            All Users
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {allUsersWithAdmin.length} user{allUsersWithAdmin.length !== 1 ? 's' : ''}
          </span>
        </div>

        {allUsersWithAdmin.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No users found.</p>
          </div>
        ) : (
          <>
            {/* ---- Desktop Table View ---- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allUsersWithAdmin.map((user) => {
                    const isHardCodedAdmin = user.id === 'admin-001';
                    const isCurrentUser = session && user.id === session.id;
                    const canDelete = !isHardCodedAdmin && !isCurrentUser;

                    return (
                      <UserRow
                        key={user.id}
                        user={user}
                        canDelete={canDelete}
                        isHardCodedAdmin={isHardCodedAdmin}
                        isCurrentUser={isCurrentUser}
                        onDelete={() => handleDeleteUser(user.id, user.displayName || user.username)}
                        layout="table"
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ---- Mobile Card View ---- */}
            <div className="md:hidden divide-y divide-gray-100">
              {allUsersWithAdmin.map((user) => {
                const isHardCodedAdmin = user.id === 'admin-001';
                const isCurrentUser = session && user.id === session.id;
                const canDelete = !isHardCodedAdmin && !isCurrentUser;

                return (
                  <UserRow
                    key={user.id}
                    user={user}
                    canDelete={canDelete}
                    isHardCodedAdmin={isHardCodedAdmin}
                    isCurrentUser={isCurrentUser}
                    onDelete={() => handleDeleteUser(user.id, user.displayName || user.username)}
                    layout="card"
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}