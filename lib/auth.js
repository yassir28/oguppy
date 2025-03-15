import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'your-fallback-secret-key-for-development';
const JWT_EXPIRY = '15m';

/**
 * Hash a password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare a password with a hash
 */
export async function comparePasswords(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token for API access
 */
export function generateAccessToken(user) {
  // Remove sensitive data from user
  const userInfo = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user',
  };
  
  return jwt.sign(userInfo, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
}

/**
 * Verify JWT token
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}