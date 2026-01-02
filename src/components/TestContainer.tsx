import { useState, useEffect } from 'react';
import TestQuestion from './TestQuestion';

interface Question {
  id: string;
  questionNumber: string;
  questionText: string;
  questionImage?: string;
  options: string[];
}

interface TestContainerProps {
  testType: string;
  testName: string;
  questions: Question[];
  onSubmit: (responses: Record<string, string>) => Promise<void>;
}

export default function TestContainer({
  testType,
  testName,
  questions,
  onSubmit,
}: TestContainerProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unanswered = questions.filter((q) => !responses[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(responses);
      // Redirect will be handled by the API response
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the test.');
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(responses).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">{testName}</h2>
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {answeredCount} of {questions.length} questions answered
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleSubmit}>
        {questions.length > 0 && (
          <TestQuestion
            questionNumber={currentQuestion + 1}
            questionText={questions[currentQuestion].questionText}
            questionImage={questions[currentQuestion].questionImage}
            options={questions[currentQuestion].options}
            selectedAnswer={responses[questions[currentQuestion].id]}
            onAnswerSelect={(answer) =>
              handleAnswerSelect(questions[currentQuestion].id, answer)
            }
          />
        )}

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || answeredCount < questions.length}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}


