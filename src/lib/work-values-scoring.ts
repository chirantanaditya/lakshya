import { readFileSync } from 'fs';
import { join } from 'path';

interface WorkValuesScore {
  attributes: Record<string, number>;
  totalQuestions: number;
  answeredQuestions: number;
}

export async function calculateWorkValuesScore(
  responses: Record<string, string>
): Promise<WorkValuesScore> {
  try {
    const jsonPath = join(process.cwd(), 'data', 'work-values-questions.json');
    const fileContent = readFileSync(jsonPath, 'utf-8');
    const questions = JSON.parse(fileContent);

    // Initialize all attributes to 0
    const attributes: Record<string, number> = {
      'Intellectual Stimulation': 0,
      'Altruism': 0,
      'Economic Returns': 0,
      'Variety': 0,
      'Independence': 0,
      'Prestige': 0,
      'Aesthetic': 0,
      'Associates': 0,
      'Security': 0,
      'Way of Life': 0,
      'Supervisory Relations': 0,
      'Surrounding': 0,
      'Achievement': 0,
      'Management': 0,
      'Creativity': 0,
    };

    let answeredQuestions = 0;

    // Calculate scores for each question
    questions.forEach((question: any) => {
      const userAnswer = responses[question.itemId];
      if (userAnswer) {
        answeredQuestions++;
        
        // Find the selected option
        const selectedOption = question.options.find(
          (opt: any) => opt.label === userAnswer
        );
        
        // Add points to each attribute linked to the selected option
        if (selectedOption && selectedOption.attributes) {
          selectedOption.attributes.forEach((attr: string) => {
            if (attributes.hasOwnProperty(attr)) {
              attributes[attr] = (attributes[attr] || 0) + 1;
            }
          });
        }
      }
    });

    return {
      attributes,
      totalQuestions: questions.length,
      answeredQuestions,
    };
  } catch (error: any) {
    console.error('Error calculating work values score:', error);
    throw new Error(`Failed to calculate work values score: ${error.message}`);
  }
}

