import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { isAdmin } from '../../../lib/admin';
import { db } from '../../../db';
import { users, userTestResponses } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ cookies, url }) => {
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

    // Get query parameters
    const searchParams = url.searchParams;
    const userId = searchParams.get('userId');
    const testType = searchParams.get('testType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If userId is provided, get details for that specific user
    if (userId) {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (user.length === 0) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Get all test responses for this user
      const responses = await db
        .select()
        .from(userTestResponses)
        .where(eq(userTestResponses.userId, userId))
        .orderBy(desc(userTestResponses.completedAt));

      const { password: _, ...userWithoutPassword } = user[0];
      
      return new Response(
        JSON.stringify({
          user: userWithoutPassword,
          testResponses: responses,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all users with their test statuses
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNo: users.phoneNo,
        education: users.education,
        createdAt: users.createdAt,
        // Test statuses
        firoBStatus: users.firoBStatus,
        generalAptitudeStatus: users.generalAptitudeStatus,
        gatbPart2Status: users.gatbPart2Status,
        gatbPart3Status: users.gatbPart3Status,
        gatbPart4Status: users.gatbPart4Status,
        gatbPart5Status: users.gatbPart5Status,
        gatbPart6Status: users.gatbPart6Status,
        gatbPart7Status: users.gatbPart7Status,
        workValuesStatus: users.workValuesStatus,
        interestInventoryStatus: users.interestInventoryStatus,
        personalityAspectStatus: users.personalityAspectStatus,
        behaviorResponseStatus: users.behaviorResponseStatus,
        // Test enable flags
        enableFiroB: users.enableFiroB,
        enableWorkValues: users.enableWorkValues,
        enableGeneralAptitude: users.enableGeneralAptitude,
        enableInterestInventory: users.enableInterestInventory,
        enablePersonalityAspect: users.enablePersonalityAspect,
        enableBehaviorResponse: users.enableBehaviorResponse,
        testCompleted: users.testCompleted,
        candidateReport: users.candidateReport,
      })
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(users.createdAt));

    // Get test responses if testType is specified
    let testResponses: any[] = [];
    if (testType) {
      testResponses = await db
        .select()
        .from(userTestResponses)
        .where(eq(userTestResponses.testType, testType))
        .orderBy(desc(userTestResponses.completedAt))
        .limit(limit)
        .offset(offset);
    }

    // Get total count for pagination
    const totalUsers = await db.select({ count: users.id }).from(users);
    const totalCount = totalUsers.length;

    return new Response(
      JSON.stringify({
        users: allUsers,
        testResponses: testResponses.length > 0 ? testResponses : undefined,
        pagination: {
          limit,
          offset,
          total: totalCount,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Admin test details error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching test details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

