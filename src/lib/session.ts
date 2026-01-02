import type { AstroCookies } from 'astro';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'auth.session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface Session {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// Get secret key from environment
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || import.meta.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create a secure session token
 */
export async function createSession(session: Omit<Session, 'iat' | 'exp'>): Promise<string> {
  const secretKey = getSecretKey();
  
  const token = await new SignJWT({
    userId: session.userId,
    email: session.email,
    name: session.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .sign(secretKey);
  
  return token;
}

/**
 * Verify and decode session token
 */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Get session from cookies
 */
export async function getSession(cookies: AstroCookies): Promise<Session | null> {
  const sessionCookie = cookies.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }
  
  return await verifySession(sessionCookie.value);
}

/**
 * Set session in cookies with secure settings
 */
export async function setSession(cookies: AstroCookies, session: Omit<Session, 'iat' | 'exp'>) {
  const token = await createSession(session);
  
  const isProduction = import.meta.env.PROD;
  
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // Prevent JavaScript access
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge: SESSION_MAX_AGE,
    path: '/',
    // Add additional security headers
    ...(isProduction && {
      domain: undefined, // Let browser set domain
    }),
  });
}

/**
 * Clear session from cookies
 */
export function clearSession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: Session): boolean {
  if (!session.exp) {
    return true;
  }
  return Date.now() / 1000 > session.exp;
}
