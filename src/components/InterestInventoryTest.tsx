import { useState } from 'react';

interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  category: 'medical' | 'technology' | 'commerce' | 'arts' | 'fine-arts';
}

interface InterestInventoryTestProps {
  questions: Question[];
  onSubmit: (responses: Record<string, string>, scores: Record<string, number>) => Promise<void>;
}

export default function InterestInventoryTest({ questions, onSubmit }: InterestInventoryTestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate progress
  const answeredCount = Object.keys(responses).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const allAnswered = answeredCount === questions.length;

  // Calculate category scores
  const calculateScores = (): Record<string, number> => {
    const scores: Record<string, number> = {
      medical: 0,
      technology: 0,
      commerce: 0,
      arts: 0,
      'fine-arts': 0,
    };

    questions.forEach((question) => {
      const answer = responses[question.id];
      if (answer === 'Like') {
        scores[question.category] = (scores[question.category] || 0) + 1;
      }
    });

    return scores;
  };

  const handleAnswerSelect = (questionId: string, answer: 'Like' | 'Dislike') => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all questions are answered
    if (!allAnswered) {
      setError(`Please answer all questions. ${questions.length - answeredCount} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const scores = calculateScores();
      await onSubmit(responses, scores);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the test.');
      setIsSubmitting(false);
    }
  };

  // Category color mapping
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      medical: 'bg-red-100 text-red-800 border-red-300',
      technology: 'bg-blue-100 text-blue-800 border-blue-300',
      commerce: 'bg-green-100 text-green-800 border-green-300',
      arts: 'bg-purple-100 text-purple-800 border-purple-300',
      'fine-arts': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="w-full">
      {/* Fixed Header */}
      <div className="fixed-header bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="page-padding _100-width px-4 py-4">
          <div className="container-large container mx-auto max-w-7xl">
            <div className="heading-container relative mb-4">
              <h2 className="heading-large test-explainer text-2xl md:text-3xl font-semibold text-gray-900">
                Select the sentences that describes your interest
              </h2>
              <div className="info-wrapper absolute top-0 right-0">
                <div className="info-icon w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 cursor-help" title="Select Like or Dislike for each activity">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress_bar bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {answeredCount} of {questions.length} questions answered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Container */}
      <div className="questions-collection-container mt-40 pb-32 px-4">
        <div className="collection-list-wrapper">
          <div role="list" className="questions-container space-y-4 max-w-5xl mx-auto">
            {questions.map((question) => {
              const selectedAnswer = responses[question.id];
              const isLiked = selectedAnswer === 'Like';
              const isDisliked = selectedAnswer === 'Dislike';

              return (
                <div key={question.id} role="listitem" className="question_item w-dyn-item bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all">
                  <div className="question-wrapper">
                    <div className="number-container flex items-start gap-2 mb-6">
                      <h3 className="question-number text-xl font-semibold text-gray-900 min-w-[40px]">{question.questionNumber}</h3>
                      <h3 className="question-text _2 flex-1 text-xl text-gray-900 leading-relaxed">{question.questionText}</h3>
                    </div>
                    <div className="question-options interest-inventory flex gap-4">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, 'Like')}
                        className={`option inline-flex items-center gap-3 px-8 py-4 rounded-lg border-2 transition-all min-w-[160px] justify-center ${
                          isLiked
                            ? 'bg-green-50 border-green-500 text-green-700 font-semibold shadow-sm'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50'
                        }`}
                      >
                        <span className="option-text text-lg">👍 Like</span>
                      </button>
                      
                      {/* Dislike Button */}
                      <button
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, 'Dislike')}
                        className={`option inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 transition-all min-w-[160px] justify-center ${
                          isDisliked
                            ? 'bg-red-50 border-red-500 text-red-700 font-semibold shadow-sm'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50'
                        }`}
                      >
                        <span className="option-text text-lg">👎 Dislike</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {error}
        </div>
      )}

      {/* Submit Button Container */}
      <div className="container-large container mx-auto px-4 py-6 bg-white border-t border-gray-200 sticky bottom-0 shadow-lg">
        <div className="submit-button-container max-w-7xl mx-auto">
          <form id="wf-form-Interest-Inventory" onSubmit={handleSubmit} className="assessment-form-container">
            <button
              type="submit"
              disabled={isSubmitting || !allAnswered}
              className={`button submit-answers w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all ${
                allAnswered && !isSubmitting
                  ? 'bg-accent-red text-white hover:bg-red-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed is-unavailable'
              }`}
            >
              {isSubmitting ? 'Please wait...' : 'Submit'}
            </button>
            <div className="under-button-text mt-3 text-center text-sm text-gray-600">
              The button will turn <span className="red-highlight font-semibold text-red-600">red</span> once all the questions are answered.
              <br />
              If it is not turning red then see if you have miss any question.
            </div>
            
            {/* Hidden inputs for scores */}
            <div className="hidden">
              <input type="hidden" className="technology-results" value={calculateScores().technology} />
              <input type="hidden" className="commerce-results" value={calculateScores().commerce} />
              <input type="hidden" className="arts-results" value={calculateScores().arts} />
              <input type="hidden" className="fine-arts-results" value={calculateScores()['fine-arts']} />
              <input type="hidden" className="medical-results" value={calculateScores().medical} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
