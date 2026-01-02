import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    // Read questions from JSON file
    const jsonPath = join(process.cwd(), 'data', 'gatb-part-2-questions.json');
    
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
        const action = item['Action'] || '';
        const equationsHtml = item['Equations and Numbers'] || '';
        
        // Extract options
        const options: string[] = [];
        if (item['Option A']) options.push(item['Option A']);
        if (item['Option B']) options.push(item['Option B']);
        if (item['Option C']) options.push(item['Option C']);
        if (item['Option D']) options.push(item['Option D']);
        options.push('none of these');
        
        // Determine correct answer
        let correctAnswer = '';
        if (item['Option A Status'] === 'correct') correctAnswer = item['Option A'];
        else if (item['Option B Status'] === 'correct') correctAnswer = item['Option B'];
        else if (item['Option C Status'] === 'correct') correctAnswer = item['Option C'];
        else if (item['Option D Status'] === 'correct') correctAnswer = item['Option D'];
        else if (item['Option E Status'] === 'correct') correctAnswer = 'none of these';

        return {
          id: item['Item ID'] || `q${questionNo}`,
          questionNumber: questionNo,
          action: action,
          equationHtml: equationsHtml,
          options: options,
          correctAnswer,
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
    console.error('Error fetching GATB Part 2 questions:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch questions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

