import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { isAdmin } from '../../../lib/admin';
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

    // Check if user is admin
    const userIsAdmin = await isAdmin(session.userId);
    if (!userIsAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { userId, tests } = body;

    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!tests || typeof tests !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Tests object is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify user exists
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Map test names to database fields
    const testFieldMap: Record<string, keyof typeof users> = {
      'firo-b': 'enableFiroB',
      'work-values': 'enableWorkValues',
      'general-aptitude': 'enableGeneralAptitude',
      'interest-inventory': 'enableInterestInventory',
      'personality-aspect': 'enablePersonalityAspect',
      'behavior-response': 'enableBehaviorResponse',
    };

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update each test enable flag
    for (const [testName, enabled] of Object.entries(tests)) {
      const fieldName = testFieldMap[testName];
      if (fieldName) {
        updateData[fieldName] = enabled === true || enabled === 'true';
      }
    }

    // Update user in database
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // Fetch updated user
    const [updatedUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        enableFiroB: users.enableFiroB,
        enableWorkValues: users.enableWorkValues,
        enableGeneralAptitude: users.enableGeneralAptitude,
        enableInterestInventory: users.enableInterestInventory,
        enablePersonalityAspect: users.enablePersonalityAspect,
        enableBehaviorResponse: users.enableBehaviorResponse,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tests assigned successfully',
        user: updatedUser,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Assign tests error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while assigning tests' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

