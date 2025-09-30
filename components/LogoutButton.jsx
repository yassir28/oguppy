"use client";

import { useAuth } from '@/lib/auth-client';

export default function LogoutButton() {
  const { logout, loading } = useAuth();
  
  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
