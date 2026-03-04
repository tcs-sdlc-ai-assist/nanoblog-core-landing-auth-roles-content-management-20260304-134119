/**
 * Home.jsx
 * Authenticated blog listing page with responsive grid.
 *
 * Route: /blogs
 *
 * Features:
 *   - Displays all blog posts in a responsive grid (1-col mobile, 2-col md, 3-col lg)
 *   - Posts sorted newest first from localStorage
 *   - Admin users see an edit icon/link on each card
 *   - Empty state with illustration and CTA for admins to write first post
 *   - Max-width container with consistent padding
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';
import BlogCard from '../components/BlogCard';

/**
 * Authenticated blog listing page.
 * Fetches posts from localStorage and renders them in a responsive grid.
 *
 * @returns {JSX.Element} The blog listing page
 */
export default function Home() {
  const [posts, setPosts] = useState([]);
  const session = getSession();
  const isAdmin = session?.role === 'admin';

  // Load posts on mount
  useEffect(() => {
    const allPosts = getPosts();
    // Sort newest first by createdAt
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ---- Page Header ---- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            All Blog Posts
          </h1>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            {posts.length > 0
              ? `${posts.length} post${posts.length !== 1 ? 's' : ''} published`
              : 'No posts yet'}
          </p>
        </div>

        {/* Admin: Quick write button */}
        {isAdmin && posts.length > 0 && (
          <Link
            to="/write"
            className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">Write</span>
          </Link>
        )}
      </div>

      {/* ---- Content ---- */}
      {posts.length === 0 ? (
        /* ---- Empty State ---- */
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          {/* Illustration */}
          <div className="w-40 h-40 mb-6 text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.8}
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No blogs yet
          </h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Be the first to write one! Share your thoughts, ideas, and stories
            with the world.
          </p>

          {/* Admin CTA to write first post */}
          {isAdmin && (
            <Link
              to="/write"
              className="btn-primary px-6 py-3 text-base animate-pulse-glow"
            >
              Write your first post
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          )}

          {/* Viewer message */}
          {!isAdmin && (
            <p className="text-sm text-gray-400">
              Check back soon — new content is on the way!
            </p>
          )}
        </div>
      ) : (
        /* ---- Blog Post Grid ---- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s`, animationFillMode: 'both' }}
            >
              <BlogCard post={post} showEdit={isAdmin} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}