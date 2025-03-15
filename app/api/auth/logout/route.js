import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePasswords } from '@/lib/auth';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Check if user exists and password is correct
    if (!user || !(await comparePasswords(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Create JWT session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = jwt.sign(
      { userId: user.id, expiresAt: expiresAt.toISOString() },
      process.env.SESSION_SECRET || 'your-fallback-secret-key-for-development',
      { expiresIn: '7d' }
    );
    
    // Set session cookie
    cookies().set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/',
    });
    
    // Return user info (without password)
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}