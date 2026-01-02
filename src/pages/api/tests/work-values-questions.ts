import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    const jsonPath = join(process.cwd(), 'data', 'work-values-questions.json');
    const fileContent = readFileSync(jsonPath, 'utf-8');
    const questions = JSON.parse(fileContent);
    
    return new Response(
      JSON.stringify({ questions }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching work values questions:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch questions', questions: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

