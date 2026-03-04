/**
 * BlogCard.jsx
 * Reusable blog post preview card with color accent.
 *
 * Props:
 *   - post {Object}       — The blog post object (id, title, content, excerpt, createdAt, author)
 *   - isAdmin {boolean}   — Whether the current user is an admin (shows Edit button)
 *   - index {number}      — Optional index for color accent cycling
 *
 * Features:
 *   - Top border color accent cycling through 4 colors based on index or id hash
 *   - Displays title, excerpt (first 120 chars), formatted date, and author
 *   - Click navigates to /blog/:id
 *   - Admin users see a small Edit pencil icon button
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Color accent options for the top border
const ACCENT_COLORS = [
  { border: 'border-indigo-500', bg: 'bg-indigo-500', text: 'text-indigo-500' },
  { border: 'border-violet-500', bg: 'bg-violet-500', text: 'text-violet-500' },
  { border: 'border-pink-500', bg: 'bg-pink-500', text: 'text-pink-500' },
  { border: 'border-teal-500', bg: 'bg-teal-500', text: 'text-teal-500' },
];

/**
 * Computes a simple numeric hash from a string.
 * Used as a fallback when no index is provided.
 * @param {string} str - The string to hash
 * @returns {number} A positive integer hash
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Formats an ISO date string to "MMM DD, YYYY" format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Truncates text to a maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Reusable blog post preview card component.
 *
 * @param {Object} props
 * @param {Object} props.post - The blog post object
 * @param {boolean} [props.isAdmin=false] - Whether to show admin actions (Edit button)
 * @param {number} [props.index] - Optional index for deterministic color accent cycling
 * @returns {JSX.Element} A styled blog post preview card
 */
export default function BlogCard({ post, isAdmin = false, index }) {
  const navigate = useNavigate();

  if (!post) return null;

  // Determine accent color: use index if provided, otherwise hash the post id
  const colorIndex =
    typeof index === 'number'
      ? index % ACCENT_COLORS.length
      : simpleHash(post.id || '') % ACCENT_COLORS.length;
  const accent = ACCENT_COLORS[colorIndex];

  // Build the excerpt: prefer post.excerpt, fall back to truncated content
  const excerpt = post.excerpt
    ? truncate(post.excerpt, 120)
    : truncate(post.content, 120);

  const formattedDate = formatDate(post.createdAt);
  const authorName = post.author || 'Unknown';

  /**
   * Handles card click — navigates to the full blog post view.
   */
  function handleCardClick() {
    navigate(`/blog/${post.id}`);
  }

  /**
   * Handles Edit button click — navigates to edit page.
   * Stops propagation so the card click handler doesn't also fire.
   * @param {React.MouseEvent} e
   */
  function handleEditClick(e) {
    e.stopPropagation();
    navigate(`/edit/${post.id}`);
  }

  return (
    <article
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 
                  border-t-4 ${accent.border} 
                  transition-all duration-300 cursor-pointer 
                  flex flex-col overflow-hidden group animate-fade-in`}
      role="article"
      aria-label={`Blog post: ${post.title || 'Untitled'}`}
    >
      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header: Title + Edit button */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="text-lg font-semibold text-gray-900 leading-snug 
                       group-hover:text-primary-600 transition-colors duration-200 
                       line-clamp-2 flex-1"
          >
            {post.title || 'Untitled Post'}
          </h3>

          {/* Admin Edit Button */}
          {isAdmin && (
            <button
              onClick={handleEditClick}
              className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 
                         hover:text-primary-600 hover:bg-primary-50 
                         transition-colors duration-200 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              aria-label={`Edit post: ${post.title || 'Untitled'}`}
              title="Edit post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
            </button>
          )}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>
        )}

        {/* Footer: Date + Author */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          {/* Date */}
          {formattedDate && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M4 1.75a.75.75 0 01.75.75V3h6.5V2.5a.75.75 0 011.5 0V3h.25A2.75 2.75 0 0115.75 5.75v6.5A2.75 2.75 0 0113 15H3A2.75 2.75 0 01.25 12.25v-6.5A2.75 2.75 0 013 3h.25V2.5A.75.75 0 014 1.75zM1.75 7.5v4.75c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25V7.5H1.75z"
                  clipRule="evenodd"
                />
              </svg>
              {formattedDate}
            </span>
          )}

          {/* Author */}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
            </svg>
            {authorName}
          </span>
        </div>
      </div>
    </article>
  );
}