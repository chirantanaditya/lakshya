import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/session';
import { isAdmin } from '../../../lib/admin';
import { readFileSync } from 'fs';
import { join } from 'path';

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

    const testType = url.searchParams.get('testType');
    if (!testType) {
      return new Response(
        JSON.stringify({ error: 'Test type is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Load questions from JSON files for GATB tests
    if (testType.startsWith('gatb-part-')) {
      let jsonPath = '';
      switch (testType) {
        case 'gatb-part-1':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-1-questions.json');
          break;
        case 'gatb-part-2':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-2-questions.json');
          break;
        case 'gatb-part-3':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-3-questions.json');
          break;
        case 'gatb-part-4':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-4-questions.json');
          break;
        case 'gatb-part-5':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-5-questions.json');
          break;
        case 'gatb-part-6':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-6-questions.json');
          break;
        case 'gatb-part-7':
          jsonPath = join(process.cwd(), 'data', 'gatb-part-7-questions.json');
          break;
        default:
          return new Response(
            JSON.stringify({ error: 'Unknown test type' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
      }

      try {
        const fileContent = readFileSync(jsonPath, 'utf-8');
        const questions = JSON.parse(fileContent);
        
        return new Response(
          JSON.stringify({ questions }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        console.error('Error reading questions file:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to load questions' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // For other test types, return empty for now
    return new Response(
      JSON.stringify({ questions: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Admin test response details error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while fetching test response details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

