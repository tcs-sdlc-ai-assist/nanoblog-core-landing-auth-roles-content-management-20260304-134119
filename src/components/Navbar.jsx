/**
 * Navbar.jsx
 * Persistent authenticated navigation bar with role-based links and avatar.
 *
 * Features:
 *   - Left: NanoBlog logo linking to /blogs
 *   - Center/Right: Role-based navigation links
 *     - Admin: "All Blogs" (/blogs), "Write" (/write), "Dashboard" (/admin), "Users" (/users)
 *     - Viewer: "All Blogs" (/blogs)
 *   - Active route highlighted with indigo pill style
 *   - Far right: Avatar chip with display name and dropdown (Logout)
 *   - Mobile: Hamburger menu toggle
 *   - Logout clears session and navigates to landing page
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../utils/auth';
import { getAvatar } from '../utils/avatar';

/**
 * Authenticated navigation bar displayed on all protected pages.
 * Adapts links based on user role (admin vs viewer).
 *
 * @returns {JSX.Element} The authenticated navbar component
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = session?.role === 'admin';
  const displayName = session?.displayName || session?.username || 'User';

  // Build navigation links based on role
  const navLinks = [
    { label: 'All Blogs', to: '/blogs' },
    ...(isAdmin
      ? [
          { label: 'Write', to: '/write' },
          { label: 'Dashboard', to: '/admin' },
          { label: 'Users', to: '/users' },
        ]
      : []),
  ];

  /**
   * Checks if a given path is the active route.
   * @param {string} path - The route path to check
   * @returns {boolean} True if the path matches the current location
   */
  function isActive(path) {
    return location.pathname === path;
  }

  /**
   * Returns Tailwind classes for a nav link based on active state.
   * @param {string} path - The route path
   * @returns {string} Tailwind class string
   */
  function linkClasses(path) {
    if (isActive(path)) {
      return 'bg-indigo-100 text-indigo-700 rounded-full px-3 py-1 font-medium text-sm transition-colors duration-200';
    }
    return 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-full px-3 py-1 font-medium text-sm transition-colors duration-200';
  }

  /**
   * Handles user logout: clears session and redirects to landing page.
   */
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ---- Left: Logo / Brand ---- */}
          <Link
            to="/blogs"
            className="flex items-center gap-2 group flex-shrink-0"
            aria-label="NanoBlog home"
          >
            <span className="text-2xl" role="img" aria-hidden="true">
              📝
            </span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              NanoBlog
            </span>
          </Link>

          {/* ---- Center: Desktop Nav Links ---- */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={linkClasses(link.to)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ---- Right: Avatar Chip + Dropdown (Desktop) ---- */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              {/* Avatar chip button */}
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 
                           hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-primary-500 focus:ring-offset-1"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                {getAvatar(session?.role, 'w-6 h-6')}
                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {displayName}
                </span>
                {/* Chevron icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-slide-down">
                  {/* User info header */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {session?.role || 'viewer'}
                    </p>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                               transition-colors duration-150 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ---- Mobile: Hamburger Button ---- */}
          <div className="md:hidden flex items-center gap-2">
            {/* Small avatar for mobile */}
            {getAvatar(session?.role, 'w-8 h-8')}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                /* Close (X) icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Mobile Menu Panel ---- */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-lg">
              {getAvatar(session?.role, 'w-8 h-8')}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {session?.role || 'viewer'}
                </p>
              </div>
            </div>

            {/* Nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block ${
                  isActive(link.to)
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                } rounded-lg px-3 py-2.5 text-sm transition-colors duration-200`}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-100 my-2" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 
                         hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                  clipRule="evenodd"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}