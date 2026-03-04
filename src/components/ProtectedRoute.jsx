/**
 * ProtectedRoute.jsx
 * Role-aware route guard component for protected pages.
 *
 * Usage:
 *   <ProtectedRoute>                     — requires any authenticated session
 *   <ProtectedRoute requiredRole="admin"> — requires admin role
 *
 * Behavior:
 *   1. No session → redirect to /login
 *   2. requiredRole="admin" but user is not admin → redirect to /blogs
 *   3. Otherwise → render children
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Route guard wrapper that checks authentication and optional role requirements.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content to render
 * @param {string} [props.requiredRole] - Optional role requirement (e.g., 'admin')
 * @returns {JSX.Element} The children if authorized, or a Navigate redirect
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const session = getSession();

  // No authenticated session — redirect to login
  if (!session || !session.id || !session.username) {
    return <Navigate to="/login" replace />;
  }

  // Role check: if admin role is required but user doesn't have it, redirect to blogs
  if (requiredRole === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  // Authorized — render the protected content
  return children;
}