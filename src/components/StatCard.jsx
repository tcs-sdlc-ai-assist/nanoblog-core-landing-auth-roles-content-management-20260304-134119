/**
 * StatCard.jsx
 * Reusable statistic display card for the admin dashboard.
 *
 * Renders a colorful card tile with an icon, a large numeric value, and a descriptive label.
 * Used in AdminDashboard to display metrics like Total Posts, Total Users, Total Admins, etc.
 *
 * Props:
 *   - title {string}       — Descriptive label displayed below the value (e.g., "Total Posts")
 *   - value {number|string} — The numeric/stat value to display prominently
 *   - icon {JSX.Element}   — A JSX icon element rendered inside a colored circle
 *   - color {string}       — Tailwind color prefix for theming (e.g., "primary", "emerald", "amber", "rose")
 */

import React from 'react';

/**
 * Color mapping for background, text, and icon container styles.
 * Maps a color name to the appropriate Tailwind utility classes.
 */
const COLOR_MAP = {
  primary: {
    iconBg: 'bg-primary-100',
    iconText: 'text-primary-600',
    valueBg: 'bg-primary-50',
    border: 'border-primary-100',
  },
  indigo: {
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    valueBg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  emerald: {
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    valueBg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    valueBg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  rose: {
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
    valueBg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  violet: {
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    valueBg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    valueBg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  cyan: {
    iconBg: 'bg-cyan-100',
    iconText: 'text-cyan-600',
    valueBg: 'bg-cyan-50',
    border: 'border-cyan-100',
  },
};

/** Default/fallback color scheme */
const DEFAULT_COLORS = {
  iconBg: 'bg-gray-100',
  iconText: 'text-gray-600',
  valueBg: 'bg-gray-50',
  border: 'border-gray-100',
};

/**
 * StatCard component — a single statistic tile for the admin dashboard.
 *
 * @param {Object} props
 * @param {string} props.title - The label/description for the stat
 * @param {number|string} props.value - The numeric value to display
 * @param {JSX.Element} [props.icon] - Optional icon JSX element
 * @param {string} [props.color='primary'] - Color theme name (maps to COLOR_MAP)
 * @returns {JSX.Element} A styled stat card
 */
export default function StatCard({ title, value, icon, color = 'primary' }) {
  const colors = COLOR_MAP[color] || DEFAULT_COLORS;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${colors.border} p-6 
                  hover:shadow-md transition-shadow duration-300 animate-fade-in`}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Value and title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value !== null && value !== undefined ? value : '—'}
          </p>
        </div>

        {/* Right side: Icon in colored circle */}
        {icon && (
          <div
            className={`${colors.iconBg} ${colors.iconText} w-12 h-12 rounded-full 
                        flex items-center justify-center flex-shrink-0 ml-4`}
          >
            <div className="w-6 h-6">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}