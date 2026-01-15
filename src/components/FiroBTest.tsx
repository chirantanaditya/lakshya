import { useState } from 'react';

interface FiroBQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: string[];
}

interface FiroBTestProps {
  questions: FiroBQuestion[];
  onSubmit?: (responses: Record<string, string>) => Promise<void>;
}

export default function FiroBTest({
  questions,
  onSubmit,
}: FiroBTestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unanswered = questions.filter((q) => !responses[q.id]);
    if (unanswered.length > 0) {
      setError(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      // Scroll to first unanswered question
      const firstUnanswered = questions.find((q) => !responses[q.id]);
      if (firstUnanswered) {
        const element = document.getElementById(firstUnanswered.id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitHandler = onSubmit || (async (responses: Record<string, string>) => {
        const response = await fetch('/api/tests/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testType: 'firo-b',
            responses,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit test');
        }

        window.location.href = '/dashboard';
      });

      await submitHandler(responses);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the test.');
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(responses).length;
  const totalQuestions = questions.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Select the option that applies best to you.
          </h1>
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Information"
            aria-label="Information"
          >
            <span className="text-gray-600 font-semibold text-sm">i</span>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="text-sm text-gray-600">
          {answeredCount} of {totalQuestions} questions answered
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm">
          {questions.map((question, index) => {
            const selectedAnswer = responses[question.id];
            const isLast = index === questions.length - 1;

            return (
              <div key={question.id} id={question.id}>
                {/* Question */}
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-900">
                      {question.questionNumber}. {question.questionText}
                    </p>
                  </div>

                  {/* Options - Horizontal buttons */}
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, option)}
                        className={`px-5 py-2.5 rounded-lg border font-medium text-sm transition-all ${
                          selectedAnswer === option
                            ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                            : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                {!isLast && (
                  <div className="border-t border-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || answeredCount < totalQuestions}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </form>
    </div>
  );
}
