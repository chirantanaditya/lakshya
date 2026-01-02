import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { db } from '../../../db';
import { userTestResponses, users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { gradeGATBTest } from '../../../lib/grading';
import { calculateWorkValuesScore } from '../../../lib/work-values-scoring';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const session = await getSession(cookies);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { testType, responses, matches, part } = body;

    if (!testType) {
      return new Response(
        JSON.stringify({ error: 'Test type is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle different response formats
    let formattedResponses: Record<string, any> = {};
    let scoreResult: any = null;

    // For GATB Part 7, handle matches differently
    if (testType === 'gatb-part-7' && matches) {
      // Convert matches to response format
      formattedResponses = {
        matches,
        part,
      };
      // Part 7 grading would need special handling based on shape matching
      // For now, we'll store the matches without grading
      scoreResult = {
        totalQuestions: matches.length,
        matched: matches.length,
        part,
      };
    } else if (responses) {
      formattedResponses = responses;
      
      // Grade GATB tests (parts 1-6)
      if (testType.startsWith('gatb-part-') && testType !== 'gatb-part-7') {
        try {
          scoreResult = await gradeGATBTest(testType, responses);
        } catch (error: any) {
          console.error('Grading error:', error);
          // Continue without grading if grading fails
        }
      }
      
      // Calculate Work Values attribute scores
      if (testType === 'work-values') {
        try {
          scoreResult = await calculateWorkValuesScore(responses);
        } catch (error: any) {
          console.error('Work Values scoring error:', error);
          // Continue without scoring if scoring fails
        }
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Responses or matches are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save test responses with score
    await db.insert(userTestResponses).values({
      userId: session.userId,
      testType,
      responses: formattedResponses as any,
      score: scoreResult as any,
      completedAt: new Date(),
    });

    // Update user test status based on test type
    const statusFieldMap: Record<string, keyof typeof users> = {
      'gatb-part-1': 'generalAptitudeStatus',
      'gatb-part-2': 'gatbPart2Status',
      'gatb-part-3': 'gatbPart3Status',
      'gatb-part-4': 'gatbPart4Status',
      'gatb-part-5': 'gatbPart5Status',
      'gatb-part-6': 'gatbPart6Status',
      'gatb-part-7': 'gatbPart7Status',
      'work-values': 'workValuesStatus',
      'firo-b': 'firoBStatus',
      'interest-inventory': 'interestInventoryStatus',
      'personality-aspect': 'personalityAspectStatus',
      'behavior-response': 'behaviorResponseStatus',
    };

    const statusField = statusFieldMap[testType];
    if (statusField) {
      await db
        .update(users)
        .set({
          [statusField]: 'Completed',
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.userId));
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test submitted successfully',
        score: scoreResult,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Test submission error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while submitting the test' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};


