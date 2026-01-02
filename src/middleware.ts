import { defineMiddleware } from 'astro/middleware';
import { getSession, isSessionExpired } from './lib/session';

export const onRequest = defineMiddleware(async (context, next) => {
  // Get and validate session
  const session = await getSession(context.cookies);
  
  // Check if session is expired
  if (session && isSessionExpired(session)) {
    // Clear expired session
    const { clearSession } = await import('./lib/session');
    clearSession(context.cookies);
    context.locals.session = null;
  } else {
    context.locals.session = session;
  }
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/user-account', '/tests', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    context.url.pathname.startsWith(route)
  );
  
  // Redirect to login if accessing protected route without valid session
  if (isProtectedRoute && !context.locals.session) {
    const loginUrl = new URL('/login', context.url);
    loginUrl.searchParams.set('redirect', context.url.pathname);
    return context.redirect(loginUrl.toString(), 302);
  }
  
  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(context.url.pathname);
  
  if (isAuthRoute && context.locals.session) {
    return context.redirect('/dashboard', 302);
  }
  
  return next();
});

// Extend Astro's Locals interface
declare global {
  namespace App {
    interface Locals {
      session: {
        userId: string;
        email: string;
        name: string;
        iat?: number;
        exp?: number;
      } | null;
    }
  }
}

