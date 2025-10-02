"use client"

import { useState, useEffect } from 'react'
import Sidebar2 from '@/components/dashboard/Sidebar2';
import Header from '@/components/dashboard/Header';
import AuthProvider from '@/context/AuthProvider';

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  // Show sidebar by default on large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AuthProvider>

    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar2 showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${showSidebar ? 'lg:ml-60' : 'ml-0'}`}>
        {/* Header */}
        <Header setShowSidebar={setShowSidebar}  showSidebar={showSidebar} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
    </AuthProvider>
  )
}