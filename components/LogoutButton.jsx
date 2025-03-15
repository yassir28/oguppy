"use client";

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Navigate to login page
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}