/**
 * App.jsx
 * Root application component with route definitions and layout logic.
 *
 * Route Map:
 *   - '/'          → Redirects to /home
 *   - '/home'      → LandingPage (public)
 *   - '/login'     → LoginPage (public)
 *   - '/register'  → RegisterPage (public)
 *   - '/blogs'     → Home (protected, any role)
 *   - '/blog/:id'  → ReadBlog (protected, any role)
 *   - '/write'     → WriteBlog (protected, admin only)
 *   - '/edit/:id'  → WriteBlog (protected, admin only)
 *   - '/admin'     → AdminDashboard (protected, admin only)
 *   - '/users'     → UserManagement (protected, admin only)
 *
 * Layout Logic:
 *   - Public routes (/home, /login, /register) render PublicNavbar
 *   - Authenticated routes render Navbar
 *   - All content wrapped in a bg-slate-50 min-h-screen container
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getSession } from './utils/auth';

// Layout components
import PublicNavbar from './components/PublicNavbar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';
import WriteBlog from './pages/WriteBlog';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

/**
 * Set of route paths that are considered "public" (no auth required).
 * These routes display the PublicNavbar instead of the authenticated Navbar.
 */
const PUBLIC_ROUTES = new Set(['/home', '/login', '/register', '/']);

/**
 * Root application component.
 * Determines which navbar to display based on the current route and session state,
 * then renders the appropriate page via React Router v6.
 *
 * @returns {JSX.Element} The full application layout with routing
 */
export default function App() {
  const location = useLocation();
  const session = getSession();
  const isAuthenticated = session && session.id && session.username;

  // Determine if the current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.has(location.pathname);

  // Show PublicNavbar on public routes, Navbar on authenticated routes
  const showPublicNavbar = isPublicRoute;
  const showAuthNavbar = !isPublicRoute && isAuthenticated;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* ---- Conditional Navbar ---- */}
      {showPublicNavbar && <PublicNavbar />}
      {showAuthNavbar && <Navbar />}

      {/* ---- Main Content / Routes ---- */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes — Any authenticated user */}
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <ReadBlog />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes — Admin only */}
          <Route
            path="/write"
            element={
              <ProtectedRoute requiredRole="admin">
                <WriteBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <WriteBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
}