import { getUserByEmail } from './auth';

/**
 * Get admin emails from environment variables
 * Tries multiple methods to ensure compatibility
 */
function getAdminEmails(): string {
  // Try multiple ways to access the environment variable
  // 1. process.env (Node.js runtime)
  // 2. import.meta.env (Astro/Vite)
  // 3. Explicitly load from .env if needed
  
  let adminEmails = '';
  
  // Try process.env first (works in Node.js runtime)
  if (typeof process !== 'undefined' && process.env) {
    adminEmails = process.env.ADMIN_EMAILS || '';
  }
  
  // Try import.meta.env (Astro/Vite)
  if (!adminEmails && typeof import.meta !== 'undefined' && import.meta.env) {
    adminEmails = import.meta.env.ADMIN_EMAILS || import.meta.env.PUBLIC_ADMIN_EMAILS || '';
  }
  
  // Remove quotes if present (sometimes .env files have quotes)
  if (adminEmails) {
    adminEmails = adminEmails.replace(/^['"]|['"]$/g, '').trim();
  }
  
  return adminEmails;
}

/**
 * Check if an email is an admin email
 * Admin emails are configured via ADMIN_EMAILS environment variable (comma-separated)
 */
export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  
  // Debug logging (remove in production)
  if (import.meta.env.DEV) {
    console.log('[Admin Check] Email:', email);
    console.log('[Admin Check] ADMIN_EMAILS env var:', adminEmails ? `SET: "${adminEmails}"` : 'NOT SET');
    if (adminEmails) {
      console.log('[Admin Check] Admin emails list:', adminEmails.split(',').map(e => e.trim().toLowerCase()));
    }
  }
  
  if (!adminEmails) {
    console.warn('[Admin Check] ADMIN_EMAILS environment variable is not set. Add it to your .env file.');
    console.warn('[Admin Check] Make sure the .env file is in the project root and the server has been restarted.');
    return false;
  }
  
  const adminEmailList = adminEmails.split(',').map(e => e.trim().toLowerCase());
  const isAdmin = adminEmailList.includes(email.toLowerCase());
  
  if (import.meta.env.DEV) {
    console.log('[Admin Check] Is admin?', isAdmin);
  }
  
  return isAdmin;
}

/**
 * Check if a user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  // For now, we'll check by email
  // In the future, you can add an isAdmin field to the users table
  const { getUserById } = await import('./auth');
  const user = await getUserById(userId);
  if (!user) {
    return false;
  }
  return isAdminEmail(user.email);
}

