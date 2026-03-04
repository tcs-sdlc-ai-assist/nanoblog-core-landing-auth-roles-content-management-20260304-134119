/**
 * ReadBlog.jsx
 * Full blog post reading view with role-based actions.
 *
 * Route: /blog/:id
 *
 * Features:
 *   - Reads post by ID from localStorage via storage utility
 *   - Displays title, author with role avatar, creation date, and full content
 *   - Admin users see Edit and Delete action buttons (top-right)
 *   - Viewer users see a "← Back to All Posts" link
 *   - Delete triggers a confirmation dialog, removes the post, and redirects to /blogs
 *   - 404 state shown when post ID doesn't match any stored post
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../utils/storage';
import { getSession } from '../utils/auth';
import { getAvatar } from '../utils/avatar';

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} isoString - ISO 8601 date string
 * @returns {string} Formatted date string (e.g., "January 15, 2024 at 3:30 PM")
 */
function formatDate(isoString) {
  if (!isoString) return 'Unknown date';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Unknown date';
  }
}

/**
 * Single blog post reading page.
 * Fetches the post by :id param, displays full content, and provides
 * role-based actions (Edit/Delete for admin, Back link for viewer).
 *
 * @returns {JSX.Element} The blog reading view
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = session?.role === 'admin';

  // Load the post on mount or when ID changes
  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const foundPost = getPostById(id);
    if (foundPost) {
      setPost(foundPost);
      setNotFound(false);
    } else {
      setPost(null);
      setNotFound(true);
    }
  }, [id]);

  /**
   * Handles post deletion with a confirmation dialog.
   * On confirm, deletes the post from storage and redirects to /blogs.
   */
  function handleDelete() {
    if (deleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    const success = deletePost(id);

    if (success) {
      navigate('/blogs', { replace: true });
    } else {
      setDeleting(false);
      alert('Failed to delete the post. Please try again.');
    }
  }

  // ---- 404 State ----
  if (notFound) {
    return (
      <div className="page-container animate-fade-in">
        <div className="max-w-2xl mx-auto text-center py-20">
          {/* 404 Icon */}
          <div className="text-6xl mb-6" role="img" aria-label="Not found">
            📭
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Post Not Found
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>

          <Link
            to="/blogs"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to All Posts
          </Link>
        </div>
      </div>
    );
  }

  // ---- Loading State (brief, while post is being fetched) ----
  if (!post) {
    return (
      <div className="page-container">
        <div className="max-w-3xl mx-auto py-20 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="space-y-3 mt-8">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine accent color classes for the top border
  const colorMap = {
    primary: 'border-primary-500',
    indigo: 'border-indigo-500',
    violet: 'border-violet-500',
    blue: 'border-blue-500',
    emerald: 'border-emerald-500',
    rose: 'border-rose-500',
    amber: 'border-amber-500',
    cyan: 'border-cyan-500',
  };
  const accentBorder = colorMap[post.color] || colorMap.primary;

  // ---- Full Post View ----
  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* ---- Top Bar: Back link + Admin Actions ---- */}
        <div className="flex items-center justify-between mb-8">
          {/* Back to All Posts link */}
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 
                       hover:text-primary-600 transition-colors duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to All Posts
          </Link>

          {/* Admin Actions: Edit + Delete */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit/${post.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium 
                           text-primary-600 bg-primary-50 border border-primary-200 rounded-lg 
                           hover:bg-primary-100 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
                  />
                </svg>
                Edit
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium 
                           text-red-600 bg-red-50 border border-red-200 rounded-lg 
                           hover:bg-red-100 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* ---- Post Card ---- */}
        <article className={`bg-white rounded-xl shadow-sm border-t-4 ${accentBorder} border border-gray-100 overflow-hidden`}>
          <div className="px-6 sm:px-10 py-8 sm:py-10">
            {/* Post Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight text-balance">
              {post.title}
            </h1>

            {/* Author Info + Date */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              {/* Author with avatar */}
              <div className="flex items-center gap-2.5">
                {getAvatar(
                  post.author === 'Admin' || post.authorRole === 'admin' ? 'admin' : 'viewer',
                  'w-9 h-9'
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {post.author || 'Unknown Author'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {post.authorRole || (post.author === 'Admin' ? 'admin' : 'author')}
                  </p>
                </div>
              </div>

              {/* Separator dot */}
              <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />

              {/* Date */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                    clipRule="evenodd"
                  />
                </svg>
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
              </div>

              {/* Updated indicator */}
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-xs text-gray-400 italic">
                    (edited)
                  </span>
                </>
              )}
            </div>

            {/* Post Content */}
            <div className="prose prose-gray max-w-none">
              <div
                className="text-gray-700 leading-relaxed text-base sm:text-lg"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {post.content}
              </div>
            </div>
          </div>
        </article>

        {/* ---- Bottom Navigation ---- */}
        <div className="mt-8 mb-12 flex justify-center">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 
                       hover:text-primary-600 transition-colors duration-200 
                       px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm"
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
            Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}