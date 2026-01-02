import { useState, useEffect, useRef } from 'react';
import TestTimer from './TestTimer';

interface Option {
  image: string;
  label: string;
}

interface Question {
  id: string;
  questionNumber: string;
  questionImage: string;
  options: Option[];
  correctAnswer?: string;
}

interface GATBPart3TestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string>) => void | Promise<void>; // Optional, can use global handler
}

export default function GATBPart3Test({
  questions,
  onSubmit,
}: GATBPart3TestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoSubmittedRef = useRef(false);

  // Calculate score in real-time
  const calculateScore = (currentResponses: Record<string, string>) => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = currentResponses[q.id];
      if (userAnswer && q.correctAnswer && userAnswer === q.correctAnswer) {
        correct++;
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
      console.log(`📊 GATB Part 3 - Current Score: ${newScore.correct}/${newScore.total} (${newScore.percentage}%)`);
    }
  }, [responses, questions]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
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

    // Check if all questions are answered (unless force submit)
    if (!forceSubmit) {
      const unanswered = questions.filter((q) => !responses[q.id]);
      if (unanswered.length > 0) {
        setError(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    hasAutoSubmittedRef.current = true;

    try {
      // Try to use global handler first, then fallback to prop, then direct submission
      const globalHandler = typeof window !== 'undefined' ? (window as any).gatbPart3SubmitHandler : null;
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
            testType: 'gatb-part-3',
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
          console.log('📊 GATB Part 3 - Test Results');
          console.log('═══════════════════════════════════════');
          console.log(`✅ Correct Answers: ${result.score.correctAnswers}`);
          console.log(`❌ Incorrect Answers: ${result.score.incorrectAnswers}`);
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`🎯 Score: ${result.score.score}/${result.score.totalQuestions}`);
          console.log(`📊 Percentage: ${result.score.percentage}%`);
          console.log('═══════════════════════════════════════');
        }

        window.location.href = '/tests/gatb-part-4-instructions';
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

  const answeredCount = Object.keys(responses).length;

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Timer */}
      <TestTimer
        durationMinutes={6}
        onTimeUp={handleTimeUp}
        testName="GATB Part 3"
      />

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Select the right image.
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
        <div className="space-y-6 mb-8">
          {questions.map((question) => {
            const selectedAnswer = responses[question.id];
            
            return (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Question Number and Image */}
                  <div className="flex-shrink-0 flex items-start gap-4">
                    <span className="text-2xl font-bold text-gray-900 mt-1">
                      {question.questionNumber}.
                    </span>
                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                      <img
                        src={question.questionImage}
                        alt={`Question ${question.questionNumber}`}
                        className="max-w-full h-auto max-h-[280px] w-auto"
                      />
                    </div>
                  </div>

                  {/* Answer Options - Horizontal Layout */}
                  <div className="flex-1 flex flex-wrap gap-4 justify-start items-center">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, option.label)}
                        className={`flex-shrink-0 bg-white rounded-lg p-4 border-2 transition-all hover:shadow-md ${
                          selectedAnswer === option.label
                            ? 'border-primary-600 bg-primary-50 shadow-lg ring-2 ring-primary-300 scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={option.image}
                          alt={`Option ${option.label}`}
                          className="w-28 h-28 object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
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
            {isSubmitting ? 'Submitting...' : `Submit Test (${answeredCount}/${questions.length} answered)`}
          </button>
        </div>
      </form>
    </div>
  );
}

