import { readFileSync } from 'fs';
import { join } from 'path';

export interface InterestInventoryScore {
  categories: {
    medical: number;
    technology: number;
    commerce: number;
    arts: number;
    'fine-arts': number;
  };
  totalQuestions: number;
  answeredQuestions: number;
}

export async function calculateInterestInventoryScore(
  responses: Record<string, string>
): Promise<InterestInventoryScore> {
  try {
    const jsonPath = join(process.cwd(), 'data', 'interest-inventory-questions.json');
    const fileContent = readFileSync(jsonPath, 'utf-8');
    const questions = JSON.parse(fileContent);

    // Initialize all categories to 0
    const categories: Record<string, number> = {
      medical: 0,
      technology: 0,
      commerce: 0,
      arts: 0,
      'fine-arts': 0,
    };

    let answeredQuestions = 0;

    // Calculate scores for each question
    questions.forEach((question: any) => {
      // Find response by question number or ID
      const questionId = question.id || `q${question.questionNumber}`;
      const userAnswer = responses[questionId] || responses[question.questionNumber] || responses[String(question.questionNumber)];
      
      if (userAnswer) {
        answeredQuestions++;
        
        // Only count "Like" responses for scoring
        if (userAnswer === 'Like' || userAnswer === 'like' || userAnswer === '👍Like' || userAnswer === '👍 Like') {
          const category = question.category as string;
          if (categories.hasOwnProperty(category)) {
            categories[category] = (categories[category] || 0) + 1;
          }
        }
      }
    });

    return {
      categories: {
        medical: categories.medical || 0,
        technology: categories.technology || 0,
        commerce: categories.commerce || 0,
        arts: categories.arts || 0,
        'fine-arts': categories['fine-arts'] || 0,
      },
      totalQuestions: questions.length,
      answeredQuestions,
    };
  } catch (error: any) {
    console.error('Error calculating interest inventory score:', error);
    throw new Error(`Failed to calculate interest inventory score: ${error.message}`);
  }
}
