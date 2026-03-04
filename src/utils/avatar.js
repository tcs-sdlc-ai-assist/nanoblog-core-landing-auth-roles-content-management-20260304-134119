/**
 * avatar.js
 * Role-based avatar rendering utility.
 *
 * Exports:
 *   - getAvatar(role, size) — Returns a JSX element with an inline SVG avatar.
 *     Admin users get a shield/crown icon with a violet background.
 *     Viewer users get a person/user silhouette icon with an indigo background.
 *
 * Used in: Navbar, UserRow, ReadBlog, and other components.
 */

import React from 'react';

/**
 * Returns a circular avatar JSX element based on the user's role.
 *
 * @param {string} [role='viewer'] - The user role ('admin' or 'viewer')
 * @param {string} [size='w-8 h-8'] - Tailwind size classes for the avatar container
 * @returns {JSX.Element} A styled circular avatar with an appropriate icon
 */
export function getAvatar(role = 'viewer', size = 'w-8 h-8') {
  const isAdmin = role === 'admin';

  const bgColor = isAdmin ? 'bg-violet-600' : 'bg-indigo-500';
  const label = isAdmin ? 'Admin avatar' : 'User avatar';

  return (
    <div
      className={`${size} ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
      role="img"
      aria-label={label}
    >
      {isAdmin ? (
        /* Shield / crown icon for admin */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[60%] h-[60%] text-white"
        >
          <path
            fillRule="evenodd"
            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        /* User silhouette icon for viewer */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[60%] h-[60%] text-white"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Returns the initials-based avatar as a fallback.
 * Useful when you want to display a user's initials instead of an icon.
 *
 * @param {string} [displayName='User'] - The display name to extract initials from
 * @param {string} [role='viewer'] - The user role for background color
 * @param {string} [size='w-8 h-8'] - Tailwind size classes
 * @returns {JSX.Element} A styled circular avatar with initials
 */
export function getInitialsAvatar(displayName = 'User', role = 'viewer', size = 'w-8 h-8') {
  const isAdmin = role === 'admin';
  const bgColor = isAdmin ? 'bg-violet-600' : 'bg-indigo-500';

  // Extract up to 2 initials from the display name
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`${size} ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
      role="img"
      aria-label={`${displayName} avatar`}
    >
      <span className="text-white font-semibold text-xs leading-none">
        {initials || 'U'}
      </span>
    </div>
  );
}

export default getAvatar;