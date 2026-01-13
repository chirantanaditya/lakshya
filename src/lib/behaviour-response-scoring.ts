import { readFileSync } from 'fs';
import { join } from 'path';

export interface BehaviourResponseScore {
  totalQuestions: number;
  answeredQuestions: number;
  scores: {
    Aa: number;
    Ao: number;
    Sc: number;
    Inq: number;
    DI: number;
  };
}

/**
 * Calculate Behaviour Response test score
 * 
 * The scoring system uses 5 categories:
 * - Aa: Achievement/Acceptance
 * - Ao: Autonomy/Originality
 * - Sc: Self-Confidence/Social
 * - Inq: Inquiry/Independence
 * - DI: Determination/Imagination
 */
export async function calculateBehaviourResponseScore(
  responses: Record<string, string>
): Promise<BehaviourResponseScore> {
  try {
    console.log('Starting Behaviour Response score calculation...');
    console.log('Responses count:', Object.keys(responses).length);
    
    const jsonPath = join(process.cwd(), 'data', 'behaviour-response-questions.json');
    const fileContent = readFileSync(jsonPath, 'utf-8');
    const questions = JSON.parse(fileContent);

    console.log('Loaded questions:', questions.length);

    // Initialize all categories to 0
    const scores = {
      Aa: 0,
      Ao: 0,
      Sc: 0,
      Inq: 0,
      DI: 0,
    };

    let answeredQuestions = 0;

    // Calculate scores for each question
    questions.forEach((question: any) => {
      const questionId = question.id || `br-q${question.questionNumber}`;
      const userAnswer = responses[questionId] || responses[question.questionNumber] || responses[String(question.questionNumber)];

      if (userAnswer) {
        answeredQuestions++;
        
        // Find which option was selected and get its status
        const selectedOption = question.options.find((opt: any) => opt.text === userAnswer);
        
        if (selectedOption) {
          console.log(`Question ${question.questionNumber}: Selected "${userAnswer}", Status: ${selectedOption.status || 'None'}`);
          
          if (selectedOption.status && selectedOption.status !== 'None') {
            const status = selectedOption.status as keyof typeof scores;
            if (scores.hasOwnProperty(status)) {
              scores[status] = (scores[status] || 0) + 1;
              console.log(`  -> Incremented ${status} score to ${scores[status]}`);
            } else {
              console.warn(`  -> Unknown status: ${selectedOption.status}`);
            }
          }
        } else {
          console.warn(`Question ${question.questionNumber}: Could not find option matching "${userAnswer}"`);
        }
      } else {
        console.log(`Question ${question.questionNumber}: No answer provided`);
      }
    });

    const result = {
      totalQuestions: questions.length,
      answeredQuestions,
      scores,
    };

    console.log('Final score calculation result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error('Error calculating behaviour response score:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to calculate behaviour response score: ${error.message}`);
  }
}
