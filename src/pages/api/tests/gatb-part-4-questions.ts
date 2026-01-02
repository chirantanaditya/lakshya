import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    // Read questions from JSON file
    const jsonPath = join(process.cwd(), 'data', 'gatb-part-4-questions.json');
    
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

    // Transform CSV data to expected format
    const questions = csvData
      .map((item: any) => {
        const questionNo = item['Question No.']?.trim() || '';
        
        // Extract options
        const options: Array<{ label: string; text: string; isCorrect: boolean }> = [];
        if (item['Option A']) {
          options.push({
            label: 'a',
            text: item['Option A'],
            isCorrect: item['Option A Status'] === 'correct',
          });
        }
        if (item['Option B']) {
          options.push({
            label: 'b',
            text: item['Option B'],
            isCorrect: item['Option B Status'] === 'correct',
          });
        }
        if (item['Option C']) {
          options.push({
            label: 'c',
            text: item['Option C'],
            isCorrect: item['Option C Status'] === 'correct',
          });
        }
        if (item['Option D']) {
          options.push({
            label: 'd',
            text: item['Option D'],
            isCorrect: item['Option D Status'] === 'correct',
          });
        }

        // Get correct answers (should be exactly 2)
        const correctAnswers = options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.label);

        return {
          id: item['Item ID'] || `q${questionNo}`,
          questionNumber: questionNo,
          options: options,
          correctAnswers: correctAnswers,
        };
      })
      .sort((a: any, b: any) => {
        // Sort by question number
        const numA = parseInt(a.questionNumber) || 0;
        const numB = parseInt(b.questionNumber) || 0;
        return numA - numB;
      });

    return new Response(
      JSON.stringify({ questions }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching GATB Part 4 questions:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch questions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

