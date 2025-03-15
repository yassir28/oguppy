import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    console.log('--- Login API called ---');
    
    // Parse request body
    const body = await request.json();
    const { email, password } = body;
    
    console.log('Login attempt for email:', email);
    
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Find user
    console.log('Looking up user in database...');
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log('User not found in database for email:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    console.log('User found:', user.id);
    console.log('Stored password hash:', user.password.substring(0, 10) + '...');
    
    // Check password
    console.log('Comparing provided password with stored hash...');
    const passwordValid = await bcrypt.compare(password, user.password);
    
    console.log('Password comparison result:', passwordValid);
    
    if (!passwordValid) {
      console.log('Password does not match');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    console.log('Authentication successful!');
    
    // Create JWT session
    console.log('Creating JWT session...');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = jwt.sign(
      { userId: user.id, expiresAt: expiresAt.toISOString() },
      process.env.SESSION_SECRET || 'your-fallback-secret-key-for-development',
      { expiresIn: '7d' }
    );
    
    // Set session cookie
    console.log('Setting session cookie...');
    cookies().set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      path: '/',
    });
    
    // Return user info (without password)
    console.log('Login completed successfully');
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