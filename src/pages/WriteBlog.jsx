/**
 * WriteBlog.jsx
 * Blog post creation and editing form page (admin only).
 *
 * Routes:
 *   - /write      → Create mode: new blog post
 *   - /edit/:id   → Edit mode: update existing blog post
 *
 * Access: Admin only (enforced by ProtectedRoute wrapper in App.jsx)
 *
 * Features:
 *   - Title input (full-width) and content textarea (min h-64)
 *   - Field-level inline validation (both fields required)
 *   - Character counter below content textarea
 *   - Create mode: generates UUID, timestamp, author info from session
 *   - Edit mode: pre-fills form from existing post, updates record
 *   - Cancel button navigates back without saving
 *   - Save button redirects to /blog/:id on success
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPostById, savePost, updatePost } from '../utils/storage';

/**
 * Array of accent colors available for blog posts.
 * Used to assign a random color on creation or allow selection.
 */
const ACCENT_COLORS = [
  'primary',
  'indigo',
  'violet',
  'blue',
  'emerald',
  'amber',
  'rose',
  'teal',
  'cyan',
  'fuchsia',
];

/**
 * Maximum recommended content length (soft limit for counter display).
 */
const CONTENT_MAX_CHARS = 10000;

/**
 * WriteBlog component — handles both creation and editing of blog posts.
 *
 * @returns {JSX.Element} The blog post form page
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [color, setColor] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({ title: '', content: '' });

  // Loading / submission state
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // ============================================
  // Load existing post data in edit mode
  // ============================================
  useEffect(() => {
    if (isEditMode) {
      const existingPost = getPostById(id);
      if (!existingPost) {
        setNotFound(true);
        return;
      }

      setTitle(existingPost.title || '');
      setContent(existingPost.content || '');
      setExcerpt(existingPost.excerpt || '');
      setColor(existingPost.color || 'primary');
    } else {
      // Create mode: assign a random accent color
      const randomColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];
      setColor(randomColor);
    }
  }, [id, isEditMode]);

  // ============================================
  // Validation
  // ============================================

  /**
   * Validates form fields and sets inline errors.
   * @returns {boolean} True if the form is valid
   */
  function validate() {
    const newErrors = { title: '', content: '' };
    let isValid = true;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Title is required.';
      isValid = false;
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
      isValid = false;
    } else if (trimmedTitle.length > 200) {
      newErrors.title = 'Title must be 200 characters or fewer.';
      isValid = false;
    }

    if (!trimmedContent) {
      newErrors.content = 'Content is required.';
      isValid = false;
    } else if (trimmedContent.length < 10) {
      newErrors.content = 'Content must be at least 10 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  /**
   * Clears a specific field error when the user starts typing.
   * @param {string} field - The field name to clear the error for
   */
  function clearError(field) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  // ============================================
  // Auto-generate excerpt from content
  // ============================================

  /**
   * Generates a short excerpt from the content (first ~150 chars).
   * @param {string} text - The full content text
   * @returns {string} A truncated excerpt
   */
  function generateExcerpt(text) {
    const trimmed = text.trim();
    if (trimmed.length <= 150) return trimmed;
    // Cut at the last space before 150 chars to avoid mid-word truncation
    const cut = trimmed.substring(0, 150);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 80 ? cut.substring(0, lastSpace) : cut) + '...';
  }

  // ============================================
  // Form Submission
  // ============================================

  /**
   * Handles form submission for both create and edit modes.
   * @param {React.FormEvent} e - The form submit event
   */
  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const autoExcerpt = excerpt.trim() || generateExcerpt(trimmedContent);

    try {
      if (isEditMode) {
        // Update existing post
        const updated = updatePost(id, {
          title: trimmedTitle,
          content: trimmedContent,
          excerpt: autoExcerpt,
          color: color || 'primary',
        });

        if (updated) {
          navigate(`/blog/${id}`, { replace: true });
        } else {
          setErrors((prev) => ({ ...prev, title: 'Failed to update post. Please try again.' }));
          setLoading(false);
        }
      } else {
        // Create new post
        const newPost = savePost({
          title: trimmedTitle,
          content: trimmedContent,
          excerpt: autoExcerpt,
          author: session?.displayName || session?.username || 'Admin',
          authorId: session?.id || 'admin-001',
          color: color || 'primary',
        });

        if (newPost && newPost.id) {
          navigate(`/blog/${newPost.id}`, { replace: true });
        } else {
          setErrors((prev) => ({ ...prev, title: 'Failed to save post. Please try again.' }));
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('[WriteBlog] Error saving post:', error);
      setErrors((prev) => ({ ...prev, title: 'An unexpected error occurred.' }));
      setLoading(false);
    }
  }

  /**
   * Handles cancel action — navigates back without saving.
   */
  function handleCancel() {
    if (isEditMode) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
  }

  // ============================================
  // Not Found State (edit mode)
  // ============================================
  if (notFound) {
    return (
      <div className="page-container animate-fade-in">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-4" role="img" aria-label="Not found">
            📭
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-500 mb-6">
            The blog post you're trying to edit doesn't exist or has been deleted.
          </p>
          <button onClick={() => navigate('/blogs')} className="btn-primary">
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* ---- Page Header ---- */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Post' : 'Write New Post'}
          </h1>
          <p className="text-gray-500">
            {isEditMode
              ? 'Update your blog post below. Changes will be saved immediately.'
              : 'Create a new blog post. Fill in the title and content to publish.'}
          </p>
        </div>

        {/* ---- Form ---- */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Title Field */}
          <div>
            <label
              htmlFor="post-title"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError('title');
              }}
              placeholder="Enter your blog post title..."
              className={`input-field text-lg font-medium ${
                errors.title
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : ''
              }`}
              maxLength={200}
              autoFocus={!isEditMode}
              disabled={loading}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.title ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.title}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">{title.length}/200</span>
            </div>
          </div>

          {/* Excerpt Field (optional) */}
          <div>
            <label
              htmlFor="post-excerpt"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Excerpt{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="post-excerpt"
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary — auto-generated from content if left blank"
              className="input-field"
              maxLength={200}
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              If left empty, an excerpt will be auto-generated from the content.
            </p>
          </div>

          {/* Content Field */}
          <div>
            <label
              htmlFor="post-content"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                clearError('content');
              }}
              placeholder="Write your blog post content here..."
              rows={14}
              className={`input-field min-h-[16rem] resize-y leading-relaxed ${
                errors.content
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : ''
              }`}
              maxLength={CONTENT_MAX_CHARS}
              disabled={loading}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.content ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.content}
                </p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs ${
                  content.length > CONTENT_MAX_CHARS * 0.9
                    ? 'text-amber-600 font-medium'
                    : 'text-gray-400'
                }`}
              >
                {content.length.toLocaleString()}/{CONTENT_MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((c) => {
                const colorMap = {
                  primary: 'bg-indigo-500',
                  indigo: 'bg-indigo-600',
                  violet: 'bg-violet-500',
                  blue: 'bg-blue-500',
                  emerald: 'bg-emerald-500',
                  amber: 'bg-amber-500',
                  rose: 'bg-rose-500',
                  teal: 'bg-teal-500',
                  cyan: 'bg-cyan-500',
                  fuchsia: 'bg-fuchsia-500',
                };

                const isSelected = color === c;

                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${colorMap[c] || 'bg-gray-400'} 
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                      ${isSelected ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                    aria-label={`Select ${c} accent color`}
                    title={c.charAt(0).toUpperCase() + c.slice(1)}
                    disabled={loading}
                  />
                );
              })}
            </div>
          </div>

          {/* ---- Action Buttons ---- */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary px-5 py-2.5"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-8 py-2.5 min-w-[140px]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : isEditMode ? (
                'Update Post'
              ) : (
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}