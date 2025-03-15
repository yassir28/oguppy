import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

// Define protected and public routes
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/inventory',
  '/purchases',
  '/reports',
  '/sales'
  // Add other protected routes as needed
];

const publicPaths = [
  '/login',
  '/register',
  '/'
  // Add other public routes here
];

const secretKey = process.env.SESSION_SECRET || 'your-fallback-secret-key-for-development';

// Verify the JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path should be protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Get session cookie
  const sessionCookie = request.cookies.get("session")?.value;
  
  // Verify token synchronously in middleware (can't use async in middleware)
  const session = sessionCookie ? verifyToken(sessionCookie) : null;
  
  // Redirect unauthenticated users from protected routes to login
  if (isProtectedPath && !session?.userId) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect authenticated users from public routes (like login) to dashboard
  if (isPublicPath && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // For API routes that need protection
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!session?.userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, images, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg)).*)',
  ],
};