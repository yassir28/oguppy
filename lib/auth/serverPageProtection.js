// lib/serverPageProtection.js

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../authOptions";

/**
 * Server-side function to check if user is authenticated
 * Use this in Server Components (pages without "use client")
 * 
 * @returns {Object} session - The user session
 * @throws {Redirect} - Redirects to login if not authenticated
 */
export async function requireAuthServer() {
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session || !session.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Server-side function to check if user is ADMIN
 * Use this in Server Components for admin-only pages
 * 
 * @returns {Object} session - The user session
 * @throws {Redirect} - Redirects to unauthorized page if not admin
 */
export async function requireAdminServer() {
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session || !session.user) {
    redirect("/login");
  }

  // If not admin, redirect to unauthorized page
  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Server-side function to check if user has required role
 * Use this in Server Components for role-based pages
 * 
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Object} session - The user session
 * @throws {Redirect} - Redirects if user doesn't have required role
 */
export async function requireRoleServer(allowedRoles = []) {
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session || !session.user) {
    redirect("/login");
  }

  // Check if user has one of the allowed roles
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }

  return session;
}