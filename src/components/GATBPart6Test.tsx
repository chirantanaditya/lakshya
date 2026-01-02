import { useState, useEffect, useRef } from 'react';
import TestTimer from './TestTimer';

interface Option {
  text: string;
  label: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questionNumber: string;
  questionText: string;
  options: Option[];
  correctAnswer?: string;
}

interface GATBPart6TestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string>) => void | Promise<void>; // Optional, can use global handler
}

export default function GATBPart6Test({
  questions,
  onSubmit,
}: GATBPart6TestProps) {
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
      console.log(`📊 GATB Part 6 - Current Score: ${newScore.correct}/${newScore.total} (${newScore.percentage}%)`);
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
      const globalHandler = typeof window !== 'undefined' ? (window as any).gatbPart6SubmitHandler : null;
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
            testType: 'gatb-part-6',
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
          console.log('📊 GATB Part 6 - Test Results');
          console.log('═══════════════════════════════════════');
          console.log(`✅ Correct Answers: ${result.score.correctAnswers}`);
          console.log(`❌ Incorrect Answers: ${result.score.incorrectAnswers}`);
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`🎯 Score: ${result.score.score}/${result.score.totalQuestions}`);
          console.log(`📊 Percentage: ${result.score.percentage}%`);
          console.log('═══════════════════════════════════════');
        }

        window.location.href = '/tests/gatb-part-7-instructions';
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

  // Split questions into two columns
  const leftColumnQuestions = questions.filter((_, index) => index % 2 === 0);
  const rightColumnQuestions = questions.filter((_, index) => index % 2 === 1);

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Timer */}
      <TestTimer
        durationMinutes={7}
        onTimeUp={handleTimeUp}
        testName="GATB Part 6"
      />

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Select the right answer.
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Questions in 2-column layout */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {leftColumnQuestions.map((question) => {
              const selectedAnswer = responses[question.id];
              const firstFourOptions = question.options.slice(0, 4);
              const noneOfTheseOption = question.options[4]; // "none of these"
              
              return (
                <div
                  key={question.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  {/* Question Text */}
                  <div className="mb-4">
                    <span className="text-lg font-bold text-gray-900 mr-2">
                      {question.questionNumber}.
                    </span>
                    <span className="text-gray-900">{question.questionText}</span>
                  </div>

                  {/* Options Grid - 2x2 for first 4 options */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {firstFourOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, option.label)}
                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all text-left ${
                          selectedAnswer === option.label
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>

                  {/* "none of these" option - full width */}
                  {noneOfTheseOption && (
                    <button
                      type="button"
                      onClick={() => handleAnswerSelect(question.id, noneOfTheseOption.label)}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        selectedAnswer === noneOfTheseOption.label
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {noneOfTheseOption.text}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightColumnQuestions.map((question) => {
              const selectedAnswer = responses[question.id];
              const firstFourOptions = question.options.slice(0, 4);
              const noneOfTheseOption = question.options[4]; // "none of these"
              
              return (
                <div
                  key={question.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
                >
                  {/* Question Text */}
                  <div className="mb-4">
                    <span className="text-lg font-bold text-gray-900 mr-2">
                      {question.questionNumber}.
                    </span>
                    <span className="text-gray-900">{question.questionText}</span>
                  </div>

                  {/* Options Grid - 2x2 for first 4 options */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {firstFourOptions.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, option.label)}
                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all text-left ${
                          selectedAnswer === option.label
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>

                  {/* "none of these" option - full width */}
                  {noneOfTheseOption && (
                    <button
                      type="button"
                      onClick={() => handleAnswerSelect(question.id, noneOfTheseOption.label)}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        selectedAnswer === noneOfTheseOption.label
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {noneOfTheseOption.text}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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

