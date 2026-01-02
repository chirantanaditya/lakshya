import { useState, useEffect, useRef } from 'react';
import TestTimer from './TestTimer';

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questionNumber: string;
  options: Option[];
  correctAnswers: string[];
}

interface GATBPart4TestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string[]>) => void | Promise<void>; // Optional, can use global handler
}

export default function GATBPart4Test({
  questions,
  onSubmit,
}: GATBPart4TestProps) {
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoSubmittedRef = useRef(false);

  // Calculate score in real-time
  const calculateScore = (currentResponses: Record<string, string[]>) => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswers = currentResponses[q.id] || [];
      // Check if both answers are correct and match
      if (userAnswers.length === 2 && q.correctAnswers.length === 2) {
        const userSorted = [...userAnswers].sort().join(',');
        const correctSorted = [...q.correctAnswers].sort().join(',');
        if (userSorted === correctSorted) {
          correct++;
        }
      }
    });
    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  // Update score whenever responses change
  useEffect(() => {
    const newScore = calculateScore(responses);
    
    // Console log after each answer
    if (Object.keys(responses).length > 0) {
      console.log(`📊 GATB Part 4 - Current Score: ${newScore.correct}/${newScore.total} (${newScore.percentage}%)`);
    }
  }, [responses, questions]);

  const handleAnswerToggle = (questionId: string, optionLabel: string) => {
    setResponses((prev) => {
      const currentSelections = prev[questionId] || [];
      
      // If already selected, remove it
      if (currentSelections.includes(optionLabel)) {
        return {
          ...prev,
          [questionId]: currentSelections.filter(label => label !== optionLabel),
        };
      }
      
      // If less than 2 selected, add it
      if (currentSelections.length < 2) {
        return {
          ...prev,
          [questionId]: [...currentSelections, optionLabel],
        };
      }
      
      // If 2 already selected, replace the first one
      return {
        ...prev,
        [questionId]: [currentSelections[1], optionLabel],
      };
    });
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent, forceSubmit = false) => {
    if (e) {
      e.preventDefault();
    }

    // Prevent multiple submissions
    if (isSubmitting || hasAutoSubmittedRef.current) {
      return;
    }

    // Check if all questions have exactly 2 answers (unless force submit)
    if (!forceSubmit) {
      const incomplete: string[] = [];
      questions.forEach((q) => {
        const selections = responses[q.id] || [];
        if (selections.length !== 2) {
          incomplete.push(q.questionNumber);
        }
      });
      
      if (incomplete.length > 0) {
        setError(`Please select exactly 2 options for all questions. Questions ${incomplete.join(', ')} need ${incomplete.length === 1 ? 'an' : ''} answer${incomplete.length > 1 ? 's' : ''}.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    hasAutoSubmittedRef.current = true;

    try {
      // Try to use global handler first, then fallback to prop, then direct submission
      const globalHandler = typeof window !== 'undefined' ? (window as any).gatbPart4SubmitHandler : null;
      const submitHandler = globalHandler || onSubmit;
      
      if (submitHandler) {
        await submitHandler(responses);
      } else {
        // Direct submission fallback
        const response = await fetch('/api/tests/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testType: 'gatb-part-4',
            responses,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit test');
        }

        const result = await response.json();
        
        // Console log for score display
        if (result.score) {
          console.log('═══════════════════════════════════════');
          console.log('📊 GATB Part 4 - Test Results');
          console.log('═══════════════════════════════════════');
          console.log(`✅ Correct Answers: ${result.score.correctAnswers}`);
          console.log(`❌ Incorrect Answers: ${result.score.incorrectAnswers}`);
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`🎯 Score: ${result.score.score}/${result.score.totalQuestions}`);
          console.log(`📊 Percentage: ${result.score.percentage}%`);
          console.log('═══════════════════════════════════════');
        }

        window.location.href = '/tests/gatb-part-5-instructions';
      }
      // Redirect will be handled by the global handler
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the test.');
      setIsSubmitting(false);
      hasAutoSubmittedRef.current = false;
    }
  };

  const handleTimeUp = () => {
    if (!hasAutoSubmittedRef.current) {
      handleSubmit(undefined, true);
    }
  };

  const answeredCount = Object.keys(responses).filter(
    (qId) => responses[qId]?.length === 2
  ).length;

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Timer */}
      <TestTimer
        durationMinutes={6}
        onTimeUp={handleTimeUp}
        testName="GATB Part 4"
      />

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Select the 2 synonyms or antonyms.
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Questions List */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {questions.map((question, index) => {
            const selectedAnswers = responses[question.id] || [];
            
            return (
              <div key={question.id}>
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Question Number */}
                    <span className="text-lg font-bold text-gray-900 flex-shrink-0">
                      {question.questionNumber}.
                    </span>

                    {/* Answer Options */}
                    <div className="flex-1 flex flex-wrap gap-3">
                      {question.options.map((option, optIndex) => {
                        const isSelected = selectedAnswers.includes(option.label);
                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleAnswerToggle(question.id, option.label)}
                            className={`px-5 py-2.5 rounded-lg font-medium text-base transition-all ${
                              isSelected
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}. {option.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Separator line */}
                {index < questions.length - 1 && (
                  <div className="h-px bg-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || answeredCount < questions.length}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : `Submit Test (${answeredCount}/${questions.length} questions answered)`}
          </button>
        </div>
      </form>
    </div>
  );
}

