import { useState, useEffect } from 'react';

interface Option {
  label: string;
  text: string;
  status: string;
  attributes: string[];
}

interface Question {
  questionNumber: string;
  itemId: string;
  options: Option[];
}

interface WorkValuesTestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string>) => Promise<void>;
}

export default function WorkValuesTest({
  questions,
  onSubmit,
}: WorkValuesTestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setError(null);
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
    const unanswered = questions.filter((q) => !responses[q.itemId]);
    if (unanswered.length > 0) {
      setError(`Please answer all questions. ${unanswered.length} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const globalHandler = typeof window !== 'undefined' ? (window as any).workValuesSubmitHandler : null;
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
            testType: 'work-values',
            responses,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit test');
        }

        const result = await response.json();
        
        // Console log for score display
        if (result.score && result.score.attributes) {
          console.log('═══════════════════════════════════════');
          console.log('📊 Work Values Assessment - Results');
          console.log('═══════════════════════════════════════');
          console.log('Attribute Scores:');
          Object.entries(result.score.attributes).forEach(([attr, score]) => {
            console.log(`  ${attr}: ${score}`);
          });
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`✅ Answered Questions: ${result.score.answeredQuestions}`);
          console.log('═══════════════════════════════════════');
        }

        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the test.');
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(responses).length;
  const currentQ = questions[currentQuestion];
  const selectedAnswer = currentQ ? responses[currentQ.itemId] : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Work Values Assessment</h2>
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
        {currentQ && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                {currentQ.questionNumber}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-4">Select the option that best describes your preference:</p>
              </div>
            </div>
            
            <div className="space-y-3 ml-12">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedAnswer === option.label
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.itemId}`}
                    value={option.label}
                    checked={selectedAnswer === option.label}
                    onChange={() => handleAnswerSelect(currentQ.itemId, option.label)}
                    className="mt-1 mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                    required
                  />
                  <span className="text-gray-700 flex-1">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
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

