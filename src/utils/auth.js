/**
 * auth.js
 * Core authentication logic with hard-coded admin and session management.
 *
 * Hard-coded admin credentials:
 *   username: "admin"
 *   password: "admin"
 *
 * Exports:
 *   - login(username, password) — authenticates against hard-coded admin first,
 *     then registered users in nanoblog_users. Returns { success, session?, error? }.
 *   - logout() — clears the current session from localStorage.
 *   - getSession() — reads and returns the current session object (or null).
 *   - isAdmin() — checks whether the current session belongs to an admin.
 *   - isAuthenticated() — checks whether a valid session exists.
 */

import { getUsers, getSession as readSession, saveSession, clearSession, generateId } from './storage';

// ============================================
// Hard-coded Admin Credentials
// ============================================
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

// ============================================
// Authentication Functions
// ============================================

/**
 * Attempts to authenticate a user with the given credentials.
 *
 * 1. Checks against the hard-coded admin account first.
 * 2. Falls back to searching registered users in localStorage.
 *
 * On success, persists a session object to localStorage and returns it.
 *
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to verify
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function login(username, password) {
  // Basic input validation
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const trimmedUsername = username.trim().toLowerCase();
  const trimmedPassword = password.trim();

  // --- Check hard-coded admin credentials ---
  if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
    const session = {
      id: 'admin-001',
      username: ADMIN_USERNAME,
      displayName: 'Admin',
      role: 'admin',
      loginAt: new Date().toISOString(),
    };

    saveSession(session);
    return { success: true, session };
  }

  // --- Check registered users in localStorage ---
  const users = getUsers();
  const matchedUser = users.find(
    (user) => user.username.toLowerCase() === trimmedUsername
  );

  if (!matchedUser) {
    return { success: false, error: 'Invalid username or password.' };
  }

  // Verify password (plain-text comparison — no backend, localStorage only)
  if (matchedUser.password !== trimmedPassword) {
    return { success: false, error: 'Invalid username or password.' };
  }

  // Build session object (never store the password in the session)
  const session = {
    id: matchedUser.id,
    username: matchedUser.username,
    displayName: matchedUser.displayName || matchedUser.username,
    role: matchedUser.role || 'viewer',
    loginAt: new Date().toISOString(),
  };

  saveSession(session);
  return { success: true, session };
}

/**
 * Logs out the current user by clearing the persisted session.
 * @returns {void}
 */
export function logout() {
  clearSession();
}

/**
 * Retrieves the current session object from localStorage.
 * @returns {Object|null} The session object, or null if no session exists
 */
export function getSession() {
  return readSession();
}

/**
 * Checks whether the current session belongs to an admin user.
 * @returns {boolean} True if the current user has the "admin" role
 */
export function isAdmin() {
  const session = readSession();
  return session !== null && session.role === 'admin';
}

/**
 * Checks whether a valid authenticated session exists.
 * @returns {boolean} True if a session with at least an id and username is present
 */
export function isAuthenticated() {
  const session = readSession();
  return session !== null && Boolean(session.id) && Boolean(session.username);
}