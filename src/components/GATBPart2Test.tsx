import { useState, useEffect, useRef } from 'react';
import TestTimer from './TestTimer';

interface Question {
  id: string;
  questionNumber: string;
  action: string;
  equationHtml: string;
  options: string[];
  correctAnswer?: string;
}

interface GATBPart2TestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string>) => void | Promise<void>; // Optional, can use global handler
}

export default function GATBPart2Test({
  questions,
  onSubmit,
}: GATBPart2TestProps) {
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
      console.log(`📊 GATB Part 2 - Current Score: ${newScore.correct}/${newScore.total} (${newScore.percentage}%)`);
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
      const globalHandler = typeof window !== 'undefined' ? (window as any).gatbPart2SubmitHandler : null;
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
            testType: 'gatb-part-2',
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
          console.log('📊 GATB Part 2 - Test Results');
          console.log('═══════════════════════════════════════');
          console.log(`✅ Correct Answers: ${result.score.correctAnswers}`);
          console.log(`❌ Incorrect Answers: ${result.score.incorrectAnswers}`);
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`🎯 Score: ${result.score.score}/${result.score.totalQuestions}`);
          console.log(`📊 Percentage: ${result.score.percentage}%`);
          console.log('═══════════════════════════════════════');
        }

        window.location.href = '/tests/gatb-part-3-instructions';
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

  // Parse HTML to extract numbers or render image
  const parseEquation = (html: string) => {
    // Check if it's an image
    const imgMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    if (imgMatch) {
      return { type: 'image', src: imgMatch[1] };
    }
    
    // Extract h3 tags (numbers)
    const numbers: string[] = [];
    const h3Matches = html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/gi);
    for (const match of h3Matches) {
      numbers.push(match[1].trim());
    }
    
    return { type: 'numbers', numbers };
  };

  const answeredCount = Object.keys(responses).length;

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Timer */}
      <TestTimer
        durationMinutes={6}
        onTimeUp={handleTimeUp}
        testName="GATB Part 2"
      />

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Select the right answer.
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Questions Grid - 2x2 layout */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {questions.map((question) => {
            const selectedAnswer = responses[question.id];
            const equation = parseEquation(question.equationHtml);
            
            return (
              <div
                key={question.id}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                {/* Question Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {question.questionNumber}.{question.action}
                  </h3>
                </div>

                {/* Equation Display */}
                <div className="mb-8 flex flex-col items-center justify-center min-h-[140px] bg-gray-50 rounded-lg p-6">
                  {equation.type === 'image' ? (
                    <img
                      src={equation.src}
                      alt={`Question ${question.questionNumber}`}
                      className="max-w-full h-auto"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      {equation.numbers?.map((num, idx) => (
                        <div key={idx} className="text-3xl font-bold text-gray-900">
                          {num}
                        </div>
                      ))}
                      {equation.numbers && equation.numbers.length > 0 && (
                        <div className="w-20 h-0.5 bg-gray-500 mt-2"></div>
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAnswerSelect(question.id, option)}
                      className={`px-5 py-3 rounded-full font-semibold text-base transition-all ${
                        selectedAnswer === option
                          ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-300'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
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

