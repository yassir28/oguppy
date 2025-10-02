// lib/hooks/useRole.js
"use client"

import { useSession } from "next-auth/react";

/**
 * Custom hook to check user roles in client components
 * Makes it easy to show/hide UI elements based on user permissions
 * 
 * @returns {Object} Role checking functions
 */
export function useRole() {
  const { data: session, status } = useSession();

  return {
    // Current user's role
    role: session?.user?.role || null,
    
    // Check if user is authenticated
    isAuthenticated: status === "authenticated",
    
    // Check if loading
    isLoading: status === "loading",
    
    // Check if user is ADMIN
    isAdmin: session?.user?.role === "ADMIN",
    
    // Check if user is regular USER
    isUser: session?.user?.role === "USER",
    
    // Check if user is ITEM_MANAGER
    isItemManager: session?.user?.role === "ITEM_MANAGER",
    
    // Check if user is BRAND_MANAGER
    isBrandManager: session?.user?.role === "BRAND_MANAGER",
    
    // Check if user can manage items (ADMIN or ITEM_MANAGER)
    canManageItems: ["ADMIN", "ITEM_MANAGER"].includes(session?.user?.role),
    
    // Check if user can manage brands/categories (ADMIN or BRAND_MANAGER)
    canManageBrands: ["ADMIN", "BRAND_MANAGER"].includes(session?.user?.role),


    // Check if user has one of the specified roles
    hasRole: (allowedRoles = []) => {
      if (!session?.user?.role) return false;
      return allowedRoles.includes(session.user.role);
    },
    
    // Get the session object
    session,
  };
}