/**
 * RegisterPage.jsx
 * Self-service viewer registration page.
 *
 * Features:
 *   - Full-viewport gradient background matching the login page
 *   - Centered card with fields: Display Name, Username, Password, Confirm Password
 *   - Validations: all fields required, passwords must match, username unique
 *     (checks nanoblog_users and hard-coded admin username)
 *   - On success: saves user with viewer role, UUID, timestamp to nanoblog_users;
 *     creates session; redirects to /blogs
 *   - Link to /login for existing users
 *   - Already-authenticated users are redirected to /blogs
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, isAuthenticated } from '../utils/auth';
import { getUsers, saveUser, saveSession, generateId } from '../utils/storage';

/**
 * RegisterPage component.
 * Renders a registration form for new viewer accounts.
 *
 * @returns {JSX.Element} The registration page
 */
export default function RegisterPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hard-coded admin username to prevent registration conflicts
  const ADMIN_USERNAME = 'admin';

  // Redirect already-authenticated users
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/blogs', { replace: true });
    }
  }, [navigate]);

  /**
   * Validates form inputs and returns an error message if invalid.
   * @returns {string} Error message, or empty string if valid
   */
  function validateForm() {
    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedDisplayName) {
      return 'Display name is required.';
    }

    if (!trimmedUsername) {
      return 'Username is required.';
    }

    if (trimmedUsername.length < 3) {
      return 'Username must be at least 3 characters.';
    }

    if (/\s/.test(trimmedUsername)) {
      return 'Username cannot contain spaces.';
    }

    if (!trimmedPassword) {
      return 'Password is required.';
    }

    if (trimmedPassword.length < 4) {
      return 'Password must be at least 4 characters.';
    }

    if (!trimmedConfirmPassword) {
      return 'Please confirm your password.';
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return 'Passwords do not match.';
    }

    // Check uniqueness against hard-coded admin
    if (trimmedUsername.toLowerCase() === ADMIN_USERNAME) {
      return 'This username is already taken.';
    }

    // Check uniqueness against registered users
    const existingUsers = getUsers();
    const usernameTaken = existingUsers.some(
      (user) => user.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (usernameTaken) {
      return 'This username is already taken.';
    }

    return '';
  }

  /**
   * Handles form submission: validates, saves user, creates session, redirects.
   * @param {React.FormEvent} e - The form submit event
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const trimmedUsername = username.trim().toLowerCase();
      const trimmedDisplayName = displayName.trim();
      const trimmedPassword = password.trim();

      // Create the new user object
      const newUser = {
        id: generateId(),
        username: trimmedUsername,
        displayName: trimmedDisplayName,
        password: trimmedPassword,
        role: 'viewer',
        createdAt: new Date().toISOString(),
      };

      // Save user to nanoblog_users
      const savedUser = saveUser(newUser);

      if (!savedUser) {
        setError('Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      // Create session for the new user
      const session = {
        id: savedUser.id,
        username: savedUser.username,
        displayName: savedUser.displayName,
        role: savedUser.role,
        loginAt: new Date().toISOString(),
      };

      saveSession(session);

      // Redirect to blogs
      navigate('/blogs', { replace: true });
    } catch (err) {
      console.error('[RegisterPage] Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-12">
      {/* Registration Card */}
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/home" className="inline-flex items-center gap-2 group">
            <span className="text-4xl" role="img" aria-hidden="true">
              📝
            </span>
            <span className="text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              NanoBlog
            </span>
          </Link>
          <p className="mt-2 text-gray-500 text-sm">
            Create your account to start reading
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Create Account
          </h1>

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center animate-slide-down"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Display Name Field */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="input-field"
                autoComplete="name"
                disabled={loading}
              />
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="input-field"
                autoComplete="username"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="input-field"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="input-field"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <Link
            to="/home"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}