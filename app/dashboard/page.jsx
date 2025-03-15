import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import prisma from "../../lib/prisma";
import LogoutButton from "../components/LogoutButton";

// Helper function to verify JWT
function verifySession(token) {
  try {
    const secretKey = process.env.SESSION_SECRET || 'your-fallback-secret-key-for-development';
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

export default async function Dashboard() {
  // Get the session
  const sessionCookie = cookies().get("session")?.value;
  const session = sessionCookie ? verifySession(sessionCookie) : null;
  
  // Get user from database
  let user = null;
  if (session?.userId) {
    try {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true }
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">You need to be logged in to view this page.</p>
          <a href="/login" className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Go to Login
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      
      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium">Welcome, {user.name || user.email}!</h2>
          <p className="mt-1 text-sm text-gray-500">
            You are successfully logged in.
          </p>
        </div>
      </div>
      
      {/* Dashboard content goes here */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sample cards */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <p className="mt-1 text-sm text-gray-500">Your recent actions and updates</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">Statistics</h3>
            <p className="mt-1 text-sm text-gray-500">Key metrics and performance data</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <h3 className="text-lg font-medium">Quick Actions</h3>
            <p className="mt-1 text-sm text-gray-500">Common tasks and shortcuts</p>
          </div>
        </div>
      </div>
    </div>
  );
}