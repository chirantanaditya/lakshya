import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { db } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const session = await getSession(cookies);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    const { name, firstName, lastName, phoneNo, education } = data;

    if (!name) {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Update user profile
    await db
      .update(users)
      .set({
        name: name.trim(),
        slug,
        firstName: firstName?.trim() || null,
        lastName: lastName?.trim() || null,
        phoneNo: phoneNo?.trim() || null,
        education: education || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Profile updated successfully' 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Profile update error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while updating profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


