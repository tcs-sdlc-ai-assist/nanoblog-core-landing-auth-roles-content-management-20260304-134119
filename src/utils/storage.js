/**
 * storage.js
 * Core data persistence layer abstracting localStorage operations.
 * 
 * Provides CRUD helpers for posts, users, and session management.
 * All reads are wrapped in try/catch, returning empty arrays or null on failure.
 * 
 * localStorage keys:
 *   - nanoblog_posts    : Array of blog post objects
 *   - nanoblog_users    : Array of user objects
 *   - nanoblog_session  : Current authenticated session object
 */

// ============================================
// Storage Keys
// ============================================
const KEYS = {
  POSTS: 'nanoblog_posts',
  USERS: 'nanoblog_users',
  SESSION: 'nanoblog_session',
};

// ============================================
// UUID Generation Helper
// ============================================

/**
 * Generates a unique identifier string.
 * Uses crypto.randomUUID() when available, otherwise falls back
 * to a manual v4-style UUID generator.
 * @returns {string} A UUID string
 */
export function generateId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // Fall through to manual generation
  }

  // Fallback: manual v4-style UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// Internal Helpers
// ============================================

/**
 * Safely reads and parses a JSON value from localStorage.
 * @param {string} key - The localStorage key to read
 * @param {*} fallback - Default value if read/parse fails
 * @returns {*} Parsed value or fallback
 */
function readFromStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[NanoBlog Storage] Error reading key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely serializes and writes a value to localStorage.
 * @param {string} key - The localStorage key to write
 * @param {*} value - The value to serialize and store
 * @returns {boolean} True if write succeeded, false otherwise
 */
function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[NanoBlog Storage] Error writing key "${key}":`, error);
    return false;
  }
}

/**
 * Safely removes a key from localStorage.
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} True if removal succeeded
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[NanoBlog Storage] Error removing key "${key}":`, error);
    return false;
  }
}

// ============================================
// Posts CRUD
// ============================================

/**
 * Retrieves all blog posts from localStorage.
 * @returns {Array} Array of post objects, or empty array on failure
 */
export function getPosts() {
  return readFromStorage(KEYS.POSTS, []);
}

/**
 * Saves a new blog post to localStorage.
 * Automatically assigns an id and createdAt timestamp if not present.
 * @param {Object} post - The post object to save
 * @param {string} post.title - Post title
 * @param {string} post.content - Post content/body
 * @param {string} [post.author] - Author name
 * @param {string} [post.excerpt] - Short excerpt/summary
 * @param {string} [post.color] - Accent color for the post card
 * @returns {Object|null} The saved post object with id, or null on failure
 */
export function savePost(post) {
  try {
    const posts = getPosts();
    const newPost = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: '',
      content: '',
      excerpt: '',
      author: 'Admin',
      color: 'primary',
      ...post,
    };

    // Ensure id is always fresh if not explicitly provided in the spread
    if (!post.id) {
      newPost.id = generateId();
    }

    posts.unshift(newPost); // Add to beginning (newest first)
    writeToStorage(KEYS.POSTS, posts);
    return newPost;
  } catch (error) {
    console.error('[NanoBlog Storage] Error saving post:', error);
    return null;
  }
}

/**
 * Updates an existing blog post by id.
 * Merges provided data with the existing post and updates the timestamp.
 * @param {string} id - The post id to update
 * @param {Object} data - Partial post data to merge
 * @returns {Object|null} The updated post object, or null if not found/failed
 */
export function updatePost(id, data) {
  try {
    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      console.warn(`[NanoBlog Storage] Post with id "${id}" not found for update.`);
      return null;
    }

    const updatedPost = {
      ...posts[index],
      ...data,
      id, // Prevent id from being overwritten
      updatedAt: new Date().toISOString(),
    };

    posts[index] = updatedPost;
    writeToStorage(KEYS.POSTS, posts);
    return updatedPost;
  } catch (error) {
    console.error('[NanoBlog Storage] Error updating post:', error);
    return null;
  }
}

/**
 * Deletes a blog post by id.
 * @param {string} id - The post id to delete
 * @returns {boolean} True if the post was found and deleted
 */
export function deletePost(id) {
  try {
    const posts = getPosts();
    const filtered = posts.filter((p) => p.id !== id);

    if (filtered.length === posts.length) {
      console.warn(`[NanoBlog Storage] Post with id "${id}" not found for deletion.`);
      return false;
    }

    writeToStorage(KEYS.POSTS, filtered);
    return true;
  } catch (error) {
    console.error('[NanoBlog Storage] Error deleting post:', error);
    return false;
  }
}

// ============================================
// Users CRUD
// ============================================

/**
 * Retrieves all user accounts from localStorage.
 * @returns {Array} Array of user objects, or empty array on failure
 */
export function getUsers() {
  return readFromStorage(KEYS.USERS, []);
}

/**
 * Saves a new user to localStorage.
 * Automatically assigns an id and createdAt timestamp.
 * @param {Object} user - The user object to save
 * @param {string} user.username - Unique username
 * @param {string} user.password - User password (stored as-is; no backend)
 * @param {string} [user.role='viewer'] - User role ('admin' or 'viewer')
 * @returns {Object|null} The saved user object with id, or null on failure
 */
export function saveUser(user) {
  try {
    const users = getUsers();

    // Check for duplicate username
    const exists = users.some(
      (u) => u.username.toLowerCase() === user.username.toLowerCase()
    );
    if (exists) {
      console.warn(`[NanoBlog Storage] Username "${user.username}" already exists.`);
      return null;
    }

    const newUser = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      role: 'viewer',
      ...user,
    };

    users.push(newUser);
    writeToStorage(KEYS.USERS, users);
    return newUser;
  } catch (error) {
    console.error('[NanoBlog Storage] Error saving user:', error);
    return null;
  }
}

/**
 * Updates an existing user by id.
 * Merges provided data with the existing user record.
 * @param {string} id - The user id to update
 * @param {Object} data - Partial user data to merge
 * @returns {Object|null} The updated user object, or null if not found/failed
 */
export function updateUser(id, data) {
  try {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      console.warn(`[NanoBlog Storage] User with id "${id}" not found for update.`);
      return null;
    }

    // If username is being changed, check for duplicates
    if (data.username) {
      const duplicate = users.some(
        (u) =>
          u.id !== id &&
          u.username.toLowerCase() === data.username.toLowerCase()
      );
      if (duplicate) {
        console.warn(`[NanoBlog Storage] Username "${data.username}" already taken.`);
        return null;
      }
    }

    const updatedUser = {
      ...users[index],
      ...data,
      id, // Prevent id from being overwritten
    };

    users[index] = updatedUser;
    writeToStorage(KEYS.USERS, users);
    return updatedUser;
  } catch (error) {
    console.error('[NanoBlog Storage] Error updating user:', error);
    return null;
  }
}

/**
 * Deletes a user account by id.
 * @param {string} id - The user id to delete
 * @returns {boolean} True if the user was found and deleted
 */
export function deleteUser(id) {
  try {
    const users = getUsers();
    const filtered = users.filter((u) => u.id !== id);

    if (filtered.length === users.length) {
      console.warn(`[NanoBlog Storage] User with id "${id}" not found for deletion.`);
      return false;
    }

    writeToStorage(KEYS.USERS, filtered);
    return true;
  } catch (error) {
    console.error('[NanoBlog Storage] Error deleting user:', error);
    return false;
  }
}

// ============================================
// Session Management
// ============================================

/**
 * Retrieves the current authenticated session.
 * @returns {Object|null} Session object with user info, or null if not logged in
 */
export function getSession() {
  return readFromStorage(KEYS.SESSION, null);
}

/**
 * Stores the current authenticated session.
 * @param {Object} session - Session object (typically contains user id, username, role)
 * @returns {boolean} True if session was saved successfully
 */
export function setSession(session) {
  return writeToStorage(KEYS.SESSION, session);
}

/**
 * Clears the current session (logs the user out).
 * @returns {boolean} True if session was cleared successfully
 */
export function clearSession() {
  return removeFromStorage(KEYS.SESSION);
}

// ============================================
// Utility: Get a single post by ID
// ============================================

/**
 * Retrieves a single blog post by its id.
 * @param {string} id - The post id to find
 * @returns {Object|null} The post object, or null if not found
 */
export function getPostById(id) {
  try {
    const posts = getPosts();
    return posts.find((p) => p.id === id) || null;
  } catch (error) {
    console.error('[NanoBlog Storage] Error getting post by id:', error);
    return null;
  }
}

/**
 * Retrieves a single user by their id.
 * @param {string} id - The user id to find
 * @returns {Object|null} The user object, or null if not found
 */
export function getUserById(id) {
  try {
    const users = getUsers();
    return users.find((u) => u.id === id) || null;
  } catch (error) {
    console.error('[NanoBlog Storage] Error getting user by id:', error);
    return null;
  }
}