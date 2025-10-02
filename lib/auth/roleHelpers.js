/**
 * Helper functions for role-based access control (RBAC)
 * These functions help check user permissions throughout the app
 */

// Define role constants for consistency
export const ROLES = {
  USER: "USER",
  ITEM_MANAGER: "ITEM_MANAGER",
  BRAND_MANAGER: "BRAND_MANAGER",

  ADMIN: "ADMIN",
};

/**
 * Check if user has admin role
 * @param {Object} session - The session object from useSession() or getServerSession()
 * @returns {boolean} - True if user is admin, false otherwise
 */
export function isAdmin(session) {
  if (!session?.user?.role) return false;
  return session.user.role === ROLES.ADMIN;
}

/**
 * Check if user has regular user role
 * @param {Object} session - The session object from useSession() or getServerSession()
 * @returns {boolean} - True if user is a regular user, false otherwise
 */
export function isUser(session) {
  if (!session?.user?.role) return false;
  return session.user.role === ROLES.USER;
}


/**
 * Check if user is an item manager
 * @param {Object} session - The session object
 * @returns {boolean} - True if user is item manager
 */
export function isItemManager(session) {
  if (!session?.user?.role) return false;
  return session.user.role === ROLES.ITEM_MANAGER;
}

/**
 * Check if user is a brand manager
 * @param {Object} session - The session object
 * @returns {boolean} - True if user is brand manager
 */
export function isBrandManager(session) {
  if (!session?.user?.role) return false;
  return session.user.role === ROLES.BRAND_MANAGER;
}




/**
 * Check if user can manage items
 * ADMIN and ITEM_MANAGER can manage items
 * @param {Object} session - The session object
 * @returns {boolean} - True if user can manage items
 */
export function canManageItems(session) {
  if (!session?.user?.role) return false;
  return [ROLES.ADMIN, ROLES.ITEM_MANAGER].includes(session.user.role);
}

/**
 * Check if user can manage brands/categories
 * ADMIN and BRAND_MANAGER can manage brands/categories
 * @param {Object} session - The session object
 * @returns {boolean} - True if user can manage brands/categories
 */
export function canManageBrands(session) {
  if (!session?.user?.role) return false;
  return [ROLES.ADMIN, ROLES.BRAND_MANAGER].includes(session.user.role);
}


/**
 * Check if user has at least one of the specified roles
 * @param {Object} session - The session object
 * @param {Array} allowedRoles - Array of role strings (e.g., ['ADMIN', 'USER'])
 * @returns {boolean} - True if user has any of the allowed roles
 */
export function hasAnyRole(session, allowedRoles) {
  if (!session?.user?.role) return false;
  return allowedRoles.includes(session.user.role);
}




/**
 * Get user role from session
 * @param {Object} session - The session object
 * @returns {string|null} - The user's role or null if not found
 */
export function getUserRole(session) {
  return session?.user?.role || null;
}

/**
 * Check if session is valid and user is authenticated
 * @param {Object} session - The session object
 * @returns {boolean} - True if user is authenticated
 */
export function isAuthenticated(session) {
  return !!session?.user;
}


/**
 * Get human-readable role name
 * @param {string} role - Role constant
 * @returns {string} - Formatted role name
 */
export function getRoleName(role) {
  const roleNames = {
    USER: "User",
    ITEM_MANAGER: "Item Manager",
    BRAND_MANAGER: "Brand Manager",
    ADMIN: "Administrator",
  };
  return roleNames[role] || "Unknown";
}