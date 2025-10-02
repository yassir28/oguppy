// lib/apiAuthMiddleware.js

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../authOptions";

/**
 * Middleware to check if user is authenticated
 * Use this on API routes that require any logged-in user
 * 
 * @param {Request} request - The incoming request object
 * @returns {Object} - { session, error } 
 *   - session: The user session if authenticated
 *   - error: NextResponse error if not authenticated
 */
export async function requireAuth(request) {
  // Get the current user session
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session || !session.user) {
    return {
      session: null,
      error: NextResponse.json(
        {
          message: "Unauthorized. Please login to continue.",
        },
        { status: 401 } // 401 = Unauthorized
      ),
    };
  }

  // User is authenticated
  return { session, error: null };
}

/**
 * Middleware to check if user is an ADMIN
 * Use this on API routes that require admin privileges
 * 
 * @param {Request} request - The incoming request object
 * @returns {Object} - { session, error }
 *   - session: The user session if user is admin
 *   - error: NextResponse error if not admin or not authenticated
 */
export async function requireAdmin(request) {
  // First check if user is authenticated
  const { session, error } = await requireAuth(request);

  // If not authenticated, return the auth error
  if (error) return { session: null, error };

  // Check if user has ADMIN role
  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json(
        {
          message: "Forbidden. Admin access required.",
          currentRole: session.user.role,
        },
        { status: 403 } // 403 = Forbidden (authenticated but no permission)
      ),
    };
  }

  // User is authenticated AND is an admin
  return { session, error: null };
}

/**
 * Middleware to check if user has one of the specified roles
 * Use this for more flexible role-based access control
 * 
 * @param {Request} request - The incoming request object
 * @param {Array} allowedRoles - Array of allowed role strings ['ADMIN', 'USER']
 * @returns {Object} - { session, error }
 */
export async function requireRole(request, allowedRoles = []) {
  // First check if user is authenticated
  const { session, error } = await requireAuth(request);

  // If not authenticated, return the auth error
  if (error) return { session: null, error };

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(session.user.role)) {
    return {
      session: null,
      error: NextResponse.json(
        {
          message: "Forbidden. You don't have permission to access this resource.",
          currentRole: session.user.role,
          requiredRoles: allowedRoles,
        },
        { status: 403 }
      ),
    };
  }

  // User has the required role
  return { session, error: null };
}