/**
 * LandingPage.jsx
 * Public-facing landing page displayed at /home.
 *
 * Sections:
 *   1. Hero — Full-viewport gradient background with heading, tagline,
 *      two CTA buttons, and CSS-only animated floating card mockups.
 *   2. Features — Three colorful feature cards in a responsive row.
 *   3. Latest Posts Preview — Up to 3 recent posts from localStorage,
 *      with placeholder state if no posts exist.
 *   4. Footer — App name, copyright, and navigation links.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

/**
 * Public landing page component.
 * Renders hero, features, latest posts preview, and footer sections.
 *
 * @returns {JSX.Element} The landing page
 */
export default function LandingPage() {
  const session = getSession();
  const isLoggedIn = session && session.id && session.username;

  // Fetch up to 3 latest posts for the preview section
  const allPosts = getPosts();
  const latestPosts = allPosts.slice(0, 3);

  // Determine CTA link for "Start Reading" based on auth state
  const startReadingLink = isLoggedIn ? '/blogs' : '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* ============================================
          Section 1: Hero
          ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 min-h-[90vh] flex items-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* ---- Left: Text Content ---- */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                <span role="img" aria-hidden="true">✨</span>
                Simple. Fast. Beautiful.
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 text-balance">
                Welcome to{' '}
                <span className="block sm:inline">NanoBlog</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                A minimal, elegant blogging platform that lives entirely in your browser.
                Write freely, read beautifully — no servers, no complexity, just your words.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  to={startReadingLink}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-indigo-700 
                             font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 
                             transition-all duration-200 shadow-lg shadow-indigo-900/20 
                             hover:shadow-xl hover:shadow-indigo-900/30 text-base animate-pulse-glow"
                >
                  Start Reading
                  <span className="ml-2" aria-hidden="true">→</span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-white/15 
                             backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 
                             hover:bg-white/25 active:bg-white/30 transition-all duration-200 text-base"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Social proof / stats */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start text-white/70 text-sm">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-300">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-300">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  <span>Private & Local</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-300">
                    <path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-5.168 3.821c-.24-.076-.39-.319-.318-.558a3.97 3.97 0 00.068-1.643 3.97 3.97 0 00-.832-1.63c-.163-.19-.076-.5.166-.592A4 4 0 0114 12z" clipRule="evenodd" />
                  </svg>
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>

            {/* ---- Right: Floating Card Mockups ---- */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-full max-w-md">
                {/* Card 1 — Main */}
                <div className="animate-float bg-white rounded-2xl shadow-2xl p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-gray-800 rounded-full" />
                      <div className="h-2 w-16 bg-gray-300 rounded-full mt-1.5" />
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded-full mb-2" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded-full mb-2" />
                  <div className="h-3 w-4/6 bg-gray-200 rounded-full mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-indigo-100 rounded-full" />
                    <div className="h-6 w-20 bg-violet-100 rounded-full" />
                    <div className="h-6 w-14 bg-pink-100 rounded-full" />
                  </div>
                </div>

                {/* Card 2 — Offset top-right */}
                <div className="animate-float-delayed absolute -top-8 -right-8 bg-white rounded-xl shadow-xl p-4 w-48 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full" />
                    <div className="h-2.5 w-20 bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full mb-1.5" />
                  <div className="h-2 w-3/4 bg-gray-200 rounded-full" />
                </div>

                {/* Card 3 — Offset bottom-left */}
                <div className="animate-float-slow absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 w-44 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-pink-500 rounded-full" />
                    <div className="h-2.5 w-16 bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full mb-1.5" />
                  <div className="h-2 w-2/3 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          Section 2: Features
          ============================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              NanoBlog is designed to be simple, private, and blazing fast.
              No accounts to manage, no servers to maintain.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Write Freely */}
            <div className="card p-8 text-center group hover:-translate-y-1 transition-transform duration-300 animate-slide-up stagger-1">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                  <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Write Freely</h3>
              <p className="text-gray-500 leading-relaxed">
                Create and publish blog posts with a clean, distraction-free editor.
                Focus on your words, not the tooling.
              </p>
            </div>

            {/* Feature 2: Private & Local */}
            <div className="card p-8 text-center group hover:-translate-y-1 transition-transform duration-300 animate-slide-up stagger-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Private & Local</h3>
              <p className="text-gray-500 leading-relaxed">
                All data stays in your browser's localStorage. No servers, no tracking,
                no third-party access. Your content is yours.
              </p>
            </div>

            {/* Feature 3: Instant & Fast */}
            <div className="card p-8 text-center group hover:-translate-y-1 transition-transform duration-300 animate-slide-up stagger-3">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant & Fast</h3>
              <p className="text-gray-500 leading-relaxed">
                Zero network latency. Everything loads instantly from local storage.
                Built with Vite and React for a snappy experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          Section 3: Latest Posts Preview
          ============================================ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Latest from the Blog
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Explore the most recent posts published on NanoBlog.
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <>
              {/* Post cards grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestPosts.map((post, index) => (
                  <PostPreviewCard
                    key={post.id}
                    post={post}
                    isLoggedIn={isLoggedIn}
                    index={index}
                  />
                ))}
              </div>

              {/* View all link */}
              <div className="text-center mt-12">
                <Link
                  to={isLoggedIn ? '/blogs' : '/login'}
                  className="btn-secondary text-base px-8 py-3"
                >
                  View All Posts
                  <span className="ml-2" aria-hidden="true">→</span>
                </Link>
              </div>
            </>
          ) : (
            /* Empty state placeholder */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-400">
                  <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h12.75a3 3 0 003-3V4.875C21 3.839 20.16 3 19.125 3H4.125zM12 9.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H12zm-5.25.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V10.5zM7.5 13.5a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H7.5zm4.5 0a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Be the first to create a blog post! Sign in as an admin to start writing.
              </p>
              <Link
                to={isLoggedIn ? '/blogs' : '/login'}
                className="btn-primary text-sm px-6 py-2.5"
              >
                {isLoggedIn ? 'Go to Blogs' : 'Login to Get Started'}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          Section 4: Footer
          ============================================ */}
      <footer className="bg-slate-800 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl" role="img" aria-hidden="true">📝</span>
                <span className="text-xl font-bold text-white">NanoBlog</span>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                A minimal, elegant single-page blog application. Write, read, and manage
                your content — all within your browser.
              </p>
            </div>

            {/* Navigation links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/home" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to={isLoggedIn ? '/blogs' : '/login'} className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                    All Blogs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} NanoBlog. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm">
              Built with React, Vite & Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// Sub-component: Post Preview Card
// ============================================

/**
 * Color mapping for post accent colors.
 */
const COLOR_MAP = {
  primary: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    accent: 'bg-indigo-500',
    text: 'text-indigo-600',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    accent: 'bg-violet-500',
    text: 'text-violet-600',
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    accent: 'bg-pink-500',
    text: 'text-pink-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    text: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    text: 'text-amber-600',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'bg-blue-500',
    text: 'text-blue-600',
  },
};

/**
 * Renders a single post preview card for the landing page.
 *
 * @param {Object} props
 * @param {Object} props.post - The post object
 * @param {boolean} props.isLoggedIn - Whether the user is authenticated
 * @param {number} props.index - Card index for stagger animation
 * @returns {JSX.Element} A post preview card
 */
function PostPreviewCard({ post, isLoggedIn, index }) {
  const colors = COLOR_MAP[post.color] || COLOR_MAP.primary;

  // Link destination: authenticated users go to the post, others to login
  const linkTo = isLoggedIn ? `/blog/${post.id}` : '/login';

  // Format the date
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Generate excerpt: use post.excerpt if available, otherwise truncate content
  const excerpt =
    post.excerpt ||
    (post.content ? post.content.substring(0, 120).trim() + (post.content.length > 120 ? '...' : '') : '');

  return (
    <Link
      to={linkTo}
      className={`card overflow-hidden group hover:-translate-y-1 transition-all duration-300 
                  animate-slide-up stagger-${index + 1} block`}
    >
      {/* Color accent bar */}
      <div className={`h-1.5 ${colors.accent}`} />

      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 ${colors.accent} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-xs">
              {(post.author || 'A').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-500">{post.author || 'Admin'}</span>
          {formattedDate && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-400">{formattedDate}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
          {post.title || 'Untitled Post'}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>
        )}

        {/* Read more indicator */}
        <div className={`text-sm font-medium ${colors.text} flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}>
          {isLoggedIn ? 'Read more' : 'Login to read'}
          <span aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}