/**
 * UserRow.jsx
 * User display row/card component for the user management table.
 *
 * Props:
 *   - user {Object}        — The user object to display
 *   - currentUserId {string} — The id of the currently logged-in user
 *   - onDelete {Function}  — Callback invoked with user.id when delete is clicked
 *
 * Features:
 *   - Displays role-based avatar via getAvatar utility
 *   - Shows displayName, username, role badge pill, and creation date
 *   - Delete button is disabled for the hard-coded admin (id === 'admin-001')
 *     and for the currently logged-in user (self-deletion prevention)
 *   - Responsive: renders as a table row on desktop (md+), stacked card on mobile
 */

import React from 'react';
import { getAvatar } from '../utils/avatar';

/**
 * Formats an ISO date string into a human-readable short date.
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Returns the role badge pill JSX element.
 * @param {string} role - User role ('admin' or 'viewer')
 * @returns {JSX.Element} A styled badge pill
 */
function RoleBadge({ role }) {
  const isAdmin = role === 'admin';

  const badgeClasses = isAdmin
    ? 'bg-violet-100 text-violet-700 border-violet-200'
    : 'bg-indigo-100 text-indigo-700 border-indigo-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClasses}`}
    >
      {isAdmin ? 'Admin' : 'Viewer'}
    </span>
  );
}

/**
 * User display component that renders as a table row on desktop
 * and a stacked card on mobile.
 *
 * @param {Object} props
 * @param {Object} props.user - The user object to display
 * @param {string} props.currentUserId - The currently logged-in user's id
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @returns {JSX.Element} The user row/card component
 */
export default function UserRow({ user, currentUserId, onDelete }) {
  if (!user) return null;

  const {
    id,
    username = 'unknown',
    displayName = username,
    role = 'viewer',
    createdAt,
  } = user;

  // Determine if delete should be disabled
  const isHardCodedAdmin = id === 'admin-001';
  const isSelf = id === currentUserId;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  // Tooltip text for disabled delete button
  let deleteTooltip = 'Delete user';
  if (isHardCodedAdmin) {
    deleteTooltip = 'Default admin cannot be deleted';
  } else if (isSelf) {
    deleteTooltip = 'You cannot delete your own account';
  }

  /**
   * Handles the delete button click.
   */
  function handleDelete() {
    if (deleteDisabled) return;
    if (onDelete) {
      onDelete(id);
    }
  }

  return (
    <>
      {/* ---- Desktop: Table Row (hidden on mobile) ---- */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150">
        {/* User info cell */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {getAvatar(role, 'w-9 h-9')}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">@{username}</p>
            </div>
          </div>
        </td>

        {/* Role cell */}
        <td className="px-6 py-4">
          <RoleBadge role={role} />
        </td>

        {/* Created date cell */}
        <td className="px-6 py-4">
          <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
        </td>

        {/* Actions cell */}
        <td className="px-6 py-4 text-right">
          <button
            onClick={handleDelete}
            disabled={deleteDisabled}
            title={deleteTooltip}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
              ${
                deleteDisabled
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                  : 'text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
              }`}
          >
            {/* Trash icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
            Delete
          </button>
        </td>
      </tr>

      {/* ---- Mobile: Stacked Card (hidden on desktop) ---- */}
      <div className="md:hidden card p-4 animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Avatar + user info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {getAvatar(role, 'w-10 h-10')}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">@{username}</p>
            </div>
          </div>

          {/* Right: Role badge */}
          <RoleBadge role={role} />
        </div>

        {/* Bottom row: date + delete action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Joined {formatDate(createdAt)}
          </span>

          <button
            onClick={handleDelete}
            disabled={deleteDisabled}
            title={deleteTooltip}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200
              ${
                deleteDisabled
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                  : 'text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
              }`}
          >
            {/* Trash icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </>
  );
}