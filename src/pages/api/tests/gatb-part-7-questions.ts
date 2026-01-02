import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async ({ url }) => {
  try {
    // Read questions from JSON file
    const jsonPath = join(process.cwd(), 'data', 'gatb-part-7-questions.json');
    
    let fileContent: string;
    try {
      fileContent = readFileSync(jsonPath, 'utf-8');
    } catch (error: any) {
      console.error('Error reading questions file:', error);
      return new Response(
        JSON.stringify({ error: 'Questions file not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const csvData = JSON.parse(fileContent);

    // Get part number from query parameter (default to 1)
    const partParam = url.searchParams.get('part');
    const partNumber = partParam ? parseInt(partParam) : 1;

    // Filter questions by part
    const partQuestions = csvData
      .filter((item: any) => item.part === partNumber)
      .map((item: any) => ({
        id: item['Item ID'] || `p${partNumber}-q${item.number}`,
        number: item.number,
        imageUrl: item.imageUrl,
        part: item.part,
      }))
      .sort((a: any, b: any) => {
        const numA = parseInt(a.number) || 0;
        const numB = parseInt(b.number) || 0;
        return numA - numB;
      });

    return new Response(
      JSON.stringify({ 
        questions: partQuestions,
        part: partNumber,
        totalParts: 3,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching GATB Part 7 questions:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch questions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

