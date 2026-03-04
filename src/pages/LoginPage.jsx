/**
 * LoginPage.jsx
 * Authentication login page with role-aware redirection.
 *
 * Features:
 *   - Full-viewport gradient background (indigo → violet → pink)
 *   - Centered card with drop shadow, app logo/name at top
 *   - Username and Password input fields with focus ring styling
 *   - Login button with loading state
 *   - Register link to /register
 *   - On success: Admin → /admin, Viewer → /blogs
 *   - On failure: inline error message
 *   - Already-authenticated users are redirected immediately
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getSession } from '../utils/auth';

/**
 * Login page component rendered at /login.
 * Handles user authentication and role-based redirection.
 *
 * @returns {JSX.Element} The login page
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect already-authenticated users to their respective home
  useEffect(() => {
    const session = getSession();
    if (session && session.id && session.username) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  /**
   * Handles form submission. Calls auth.login() and redirects on success.
   * @param {React.FormEvent} e - The form submit event
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Small timeout to show loading state (simulates async feel)
    setTimeout(() => {
      const result = login(username, password);

      if (result.success && result.session) {
        // Role-based redirection
        if (result.session.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/blogs', { replace: true });
        }
      } else {
        setError(result.error || 'Invalid username or password.');
        setLoading(false);
      }
    }, 300);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center px-4 py-12">
      {/* Login Card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* ---- Logo / Brand ---- */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
              <span className="text-3xl" role="img" aria-hidden="true">
                📝
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Sign in to your NanoBlog account
            </p>
          </div>

          {/* ---- Error Message ---- */}
          {error && (
            <div
              className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-slide-down"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-red-500 flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* ---- Login Form ---- */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your username"
                required
                autoComplete="username"
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
                           focus:border-primary-500 transition-colors duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 
                           focus:border-primary-500 transition-colors duration-200"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full btn-primary py-3 text-base font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* ---- Divider ---- */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400">
                New to NanoBlog?
              </span>
            </div>
          </div>

          {/* ---- Register Link ---- */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center w-full px-6 py-2.5 
                         border-2 border-primary-600 text-primary-600 font-medium rounded-lg 
                         hover:bg-primary-50 active:bg-primary-100 transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Create an account
            </Link>
          </div>

          {/* ---- Admin Hint ---- */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Admin? Use{' '}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                admin
              </span>{' '}
              /{' '}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                admin
              </span>
            </p>
          </div>
        </div>

        {/* ---- Back to Home Link ---- */}
        <div className="text-center mt-6">
          <Link
            to="/home"
            className="text-sm text-white/80 hover:text-white transition-colors duration-200 
                       inline-flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}