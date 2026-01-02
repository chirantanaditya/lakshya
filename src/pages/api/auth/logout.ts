import type { APIRoute } from 'astro';
import { clearSession, getSession } from '../../../lib/session';

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    // Verify session exists before clearing
    const session = await getSession(cookies);
    
    if (session) {
      clearSession(cookies);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Logged out successfully' 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        } 
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear session even if there's an error
    clearSession(cookies);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Also support GET for logout (some apps use GET)
export const GET: APIRoute = async ({ cookies, redirect }) => {
  clearSession(cookies);
  return redirect('/login', 302);
};

