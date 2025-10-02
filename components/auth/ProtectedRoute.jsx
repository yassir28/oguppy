"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/loading";


export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/side-bar/home/dashboard" 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // If not authenticated at all, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // If authenticated but role not allowed, redirect to dashboard
    if (session?.user?.role && !allowedRoles.includes(session.user.role)) {
      // Show alert to user
      alert(`Access Denied! This page requires one of these roles: ${allowedRoles.join(", ")}`);
      router.push(redirectTo);
    }
  }, [session, status, router, allowedRoles, redirectTo]);

  // Show loading while checking authentication
  if (status === "loading") {
    return <Loading />;
  }

  // If not authenticated, show nothing (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  // If authenticated but wrong role, show nothing (will redirect)
  if (session?.user?.role && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  // User is authenticated and has correct role - show the page
  return <>{children}</>;
}