/**
 * PublicNavbar.jsx
 * Navigation bar for public/landing pages.
 *
 * Features:
 *   - Left: NanoBlog logo/text linking to landing page
 *   - Right (unauthenticated): "Login" and "Get Started" buttons
 *   - Right (authenticated): User avatar chip with display name, and
 *     "Go to Dashboard →" button (admin → /admin, viewer → /blogs)
 *   - Responsive layout with sticky positioning and subtle backdrop blur
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from '../utils/avatar';

/**
 * Public-facing navigation bar displayed on the landing page.
 * Adapts its right-side content based on authentication state.
 *
 * @returns {JSX.Element} The public navbar component
 */
export default function PublicNavbar() {
  const session = getSession();
  const isLoggedIn = session && session.id && session.username;
  const isAdmin = isLoggedIn && session.role === 'admin';

  // Determine dashboard link based on role
  const dashboardLink = isAdmin ? '/admin' : '/blogs';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ---- Left: Logo / Brand ---- */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="NanoBlog home"
          >
            <span className="text-2xl" role="img" aria-hidden="true">
              📝
            </span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              NanoBlog
            </span>
          </Link>

          {/* ---- Right: Auth-dependent actions ---- */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* User avatar chip */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                  {getAvatar(session.role, 'w-6 h-6')}
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {session.displayName || session.username}
                  </span>
                </div>

                {/* Mobile-only: just the avatar */}
                <div className="sm:hidden">
                  {getAvatar(session.role, 'w-8 h-8')}
                </div>

                {/* Dashboard link */}
                <Link
                  to={dashboardLink}
                  className="btn-primary text-sm px-4 py-2"
                >
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                  <span className="ml-1" aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <>
                {/* Login button */}
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary-600 
                             transition-colors duration-200 px-3 py-2"
                >
                  Login
                </Link>

                {/* Get Started button */}
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}