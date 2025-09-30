import { NextResponse } from "next/server";

export function middleware(request) {
  // ✅ Always allow all requests (skip auth checks for now)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ]
};
