import { readFileSync } from 'fs';
import { join } from 'path';

interface GradingResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  percentage: number;
  details: Array<{
    questionId: string;
    questionNumber: string;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
  }>;
}

export async function gradeGATBTest(
  testType: string,
  responses: Record<string, string | string[]>
): Promise<GradingResult> {
  try {
    let questions: any[] = [];
    let jsonPath = '';

    // Determine which JSON file to read based on test type
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
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }

    const fileContent = readFileSync(jsonPath, 'utf-8');
    const csvData = JSON.parse(fileContent);

    // Transform and grade based on test type
    let correctCount = 0;
    const details: GradingResult['details'] = [];

    if (testType === 'gatb-part-1') {
      csvData.forEach((item: any) => {
        const questionId = item['Item ID'] || `q${item['Question No']?.trim()}`;
        const userAnswer = responses[questionId] as string;
        
        let correctAnswer = '';
        if (item['Same'] === 'correct') correctAnswer = 'Same';
        else if (item['Different'] === 'correct') correctAnswer = 'Different';

        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;

        details.push({
          questionId,
          questionNumber: item['Question No']?.trim() || '',
          userAnswer: userAnswer || '',
          correctAnswer,
          isCorrect,
        });
      });
    } else if (testType === 'gatb-part-2') {
      csvData.forEach((item: any) => {
        const questionId = item['Item ID'] || `q${item['Question No.']?.trim()}`;
        const userAnswer = responses[questionId] as string;
        
        // Part 2 uses full option text (e.g., "14 men", "15 men")
        let correctAnswer = '';
        if (item['Option A Status'] === 'correct') correctAnswer = item['Option A'] || '';
        else if (item['Option B Status'] === 'correct') correctAnswer = item['Option B'] || '';
        else if (item['Option C Status'] === 'correct') correctAnswer = item['Option C'] || '';
        else if (item['Option D Status'] === 'correct') correctAnswer = item['Option D'] || '';
        else if (item['Option E Status'] === 'correct') correctAnswer = 'none of these';

        // Compare full option text
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;

        details.push({
          questionId,
          questionNumber: item['Question No.']?.trim() || '',
          userAnswer: userAnswer || '',
          correctAnswer,
          isCorrect,
        });
      });
    } else if (testType === 'gatb-part-3') {
      csvData.forEach((item: any) => {
        const questionId = item['Item ID'] || `q${item['Question No.']?.trim()}`;
        const userAnswer = responses[questionId] as string;
        
        let correctAnswer = '';
        if (item['Option A Status'] === 'correct') correctAnswer = 'A';
        else if (item['Option B Status'] === 'correct') correctAnswer = 'B';
        else if (item['Option C Status'] === 'correct') correctAnswer = 'C';
        else if (item['Option D Status'] === 'correct') correctAnswer = 'D';

        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;

        details.push({
          questionId,
          questionNumber: item['Question No.']?.trim() || '',
          userAnswer: userAnswer || '',
          correctAnswer,
          isCorrect,
        });
      });
    } else if (testType === 'gatb-part-4') {
      csvData.forEach((item: any) => {
        const questionId = item['Item ID'] || `q${item['Question No.']?.trim()}`;
        const userAnswers = (responses[questionId] as string[]) || [];
        
        // Get correct answers (should be exactly 2)
        const correctAnswers: string[] = [];
        if (item['Option A Status'] === 'correct') correctAnswers.push('a');
        if (item['Option B Status'] === 'correct') correctAnswers.push('b');
        if (item['Option C Status'] === 'correct') correctAnswers.push('c');
        if (item['Option D Status'] === 'correct') correctAnswers.push('d');

        // Check if both answers are correct and match
        const userAnswersSorted = [...userAnswers].sort().join(',');
        const correctAnswersSorted = [...correctAnswers].sort().join(',');
        const isCorrect = userAnswersSorted === correctAnswersSorted && userAnswers.length === 2;

        if (isCorrect) correctCount++;

        details.push({
          questionId,
          questionNumber: item['Question No.']?.trim() || '',
          userAnswer: userAnswers,
          correctAnswer: correctAnswers,
          isCorrect,
        });
      });
    } else if (testType === 'gatb-part-5') {
      csvData.forEach((item: any) => {
        const questionId = item['Item ID'] || `q${item['Question No.']?.trim()}`;
        const userAnswer = responses[questionId] as string;
        
        let correctAnswer = '';
        if (item['Option A Status'] === 'correct') correctAnswer = 'A';
        else if (item['Option B Status'] === 'correct') correctAnswer = 'B';
        else if (item['Option C Status'] === 'correct') correctAnswer = 'C';
        else if (item['Option D Status'] === 'correct') correctAnswer = 'D';

        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;

        details.push({
          questionId,
          questionNumber: item['Question No.']?.trim() || '',
          userAnswer: userAnswer || '',
          correctAnswer,
          isCorrect,
        });
      });
    } else if (testType === 'gatb-part-6') {
      csvData.forEach((item: any) => {
        const questionId = item['Item ID'] || `q${item['Question No.']?.trim()}`;
        const userAnswer = responses[questionId] as string;
        
        let correctAnswer = '';
        if (item['Option A Status'] === 'Correct') correctAnswer = 'A';
        else if (item['Option B Status'] === 'Correct') correctAnswer = 'B';
        else if (item['Option C Status'] === 'Correct') correctAnswer = 'C';
        else if (item['Option D Status'] === 'Correct') correctAnswer = 'D';
        else if (item['Option E Status'] === 'Correct') correctAnswer = 'E';

        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;

        details.push({
          questionId,
          questionNumber: item['Question No.']?.trim() || '',
          userAnswer: userAnswer || '',
          correctAnswer,
          isCorrect,
        });
      });
    }

    const totalQuestions = details.length;
    const incorrectCount = totalQuestions - correctCount;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      score: correctCount,
      percentage,
      details,
    };
  } catch (error: any) {
    console.error('Grading error:', error);
    throw new Error(`Failed to grade test: ${error.message}`);
  }
}

