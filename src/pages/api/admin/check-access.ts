import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { isAdmin } from '../../../lib/admin';

/**
 * Debug endpoint to check admin access
 * This helps diagnose why admin access might be failing
 */
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const session = await getSession(cookies);
    
    if (!session) {
      return new Response(
        JSON.stringify({ 
          error: 'Not logged in',
          loggedIn: false,
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userIsAdmin = await isAdmin(session.userId);
    const adminEmails = process.env.ADMIN_EMAILS || import.meta.env.ADMIN_EMAILS || 'NOT SET';

    return new Response(
      JSON.stringify({
        loggedIn: true,
        email: session.email,
        isAdmin: userIsAdmin,
        adminEmailsConfigured: adminEmails !== 'NOT SET',
        adminEmailsList: adminEmails !== 'NOT SET' 
          ? adminEmails.split(',').map(e => e.trim().toLowerCase())
          : [],
        message: userIsAdmin 
          ? 'You have admin access'
          : `You don't have admin access. Make sure your email (${session.email}) is in ADMIN_EMAILS environment variable.`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Admin check error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while checking admin access' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

