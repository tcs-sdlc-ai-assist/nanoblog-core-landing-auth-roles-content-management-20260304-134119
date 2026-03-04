/**
 * AdminDashboard.jsx
 * Admin overview dashboard with stats and quick actions.
 *
 * Features:
 *   - Gradient banner header with welcome message
 *   - Summary stat cards: Total Posts, Registered Users, Admins, Viewers
 *   - Quick-action buttons: Write New Post, Manage Users
 *   - Recent Posts section with edit/delete controls
 *   - Delete confirmation via window.confirm
 *
 * Route: /admin (admin-only, protected by ProtectedRoute)
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, getUsers, deletePost } from '../utils/storage';
import { getSession } from '../utils/auth';
import StatCard from '../components/StatCard';

/**
 * Admin dashboard page displaying key metrics, quick actions,
 * and a list of recent blog posts with management controls.
 *
 * @returns {JSX.Element} The admin dashboard page
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // Load data on mount
  useEffect(() => {
    setPosts(getPosts());
    setUsers(getUsers());
  }, []);

  // Derived stats
  const totalPosts = posts.length;
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const totalViewers = users.filter((u) => u.role === 'viewer').length;

  // Recent posts (up to 5)
  const recentPosts = posts.slice(0, 5);

  /**
   * Handles deleting a post after confirmation.
   * @param {string} postId - The ID of the post to delete
   * @param {string} postTitle - The title of the post (for confirmation message)
   */
  function handleDeletePost(postId, postTitle) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
    );

    if (confirmed) {
      deletePost(postId);
      setPosts(getPosts()); // Refresh posts list
    }
  }

  /**
   * Formats an ISO date string into a human-readable format.
   * @param {string} dateStr - ISO date string
   * @returns {string} Formatted date string
   */
  function formatDate(dateStr) {
    if (!dateStr) return 'Unknown date';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  }

  return (
    <div className="animate-fade-in">
      {/* ---- Gradient Banner Header ---- */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, {session?.displayName || 'Admin'} 👋
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl">
            Here's an overview of your blog. Manage posts, users, and keep your content fresh.
          </p>
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="page-container">
        {/* ---- Stat Cards Grid ---- */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Posts"
              value={totalPosts}
              color="indigo"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z"
                    clipRule="evenodd"
                  />
                  <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
                </svg>
              }
            />

            <StatCard
              title="Registered Users"
              value={totalUsers}
              color="emerald"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A18.034 18.034 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                </svg>
              }
            />

            <StatCard
              title="Admin Accounts"
              value={totalAdmins}
              color="violet"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.932 9.563 12.348a.749.749 0 00.374 0c5.499-1.416 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            <StatCard
              title="Viewer Accounts"
              value={totalViewers}
              color="amber"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* ---- Quick Actions ---- */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/write"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
              </svg>
              Write New Post →
            </Link>

            <Link
              to="/users"
              className="btn-secondary inline-flex items-center gap-2 px-6 py-3 text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A18.034 18.034 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Manage Users →
            </Link>
          </div>
        </section>

        {/* ---- Recent Posts ---- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Posts</h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3" role="img" aria-hidden="true">
                📭
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No posts yet</h3>
              <p className="text-gray-500 mb-4">
                Get started by writing your first blog post.
              </p>
              <Link to="/write" className="btn-primary text-sm px-5 py-2">
                Write Your First Post →
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              {/* Table header - desktop */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="col-span-5">Title</div>
                <div className="col-span-2">Author</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Post rows */}
              <ul className="divide-y divide-gray-100">
                {recentPosts.map((post, index) => (
                  <li
                    key={post.id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 animate-slide-up stagger-${index + 1}`}
                  >
                    {/* Desktop layout */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {post.title || 'Untitled Post'}
                        </Link>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-gray-500">
                          {post.author || 'Unknown'}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Link
                          to={`/edit/${post.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 
                                     bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-md transition-colors duration-150"
                          title="Edit post"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-3.5 h-3.5"
                          >
                            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 
                                     bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md transition-colors duration-150"
                          title="Delete post"
                        >
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

                    {/* Mobile layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/blog/${post.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                          >
                            {post.title || 'Untitled Post'}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>{post.author || 'Unknown'}</span>
                            <span>·</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Link
                            to={`/edit/${post.id}`}
                            className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
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
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete post"
                          >
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
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}