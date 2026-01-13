import { useState, useEffect } from 'react';

interface Option {
  text: string;
  status: string;
}

interface Question {
  id: string;
  questionNumber: number;
  options: [Option, Option];
}

interface BehaviourResponseTestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string>) => Promise<void>;
}

export default function BehaviourResponseTest({ questions, onSubmit }: BehaviourResponseTestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get submit handler - use prop if available, otherwise try global function
  const getSubmitHandler = () => {
    if (onSubmit && typeof onSubmit === 'function') {
      return onSubmit;
    }
    // Fallback to global function
    if (typeof window !== 'undefined' && (window as any).behaviourResponseSubmitHandler) {
      return (window as any).behaviourResponseSubmitHandler;
    }
    return null;
  };

  // Validate props
  useEffect(() => {
    console.log('BehaviourResponseTest mounted');
    console.log('onSubmit type:', typeof onSubmit);
    console.log('onSubmit value:', onSubmit);
    console.log('Global handler available:', typeof window !== 'undefined' && !!(window as any).behaviourResponseSubmitHandler);
    console.log('Questions count:', questions?.length || 0);
    
    const handler = getSubmitHandler();
    if (!handler) {
      console.error('No submit handler available (neither prop nor global function)');
    }
    if (!questions || questions.length === 0) {
      console.error('Questions are missing or empty');
      setError('Questions could not be loaded. Please refresh the page.');
    }
  }, [onSubmit, questions]);

  // Calculate progress
  const answeredCount = Object.keys(responses).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const allAnswered = answeredCount === questions.length;

  const handleAnswerSelect = (questionId: string, optionText: string) => {
    // Find the question and selected option to get attribute info
    const question = questions.find(q => q.id === questionId);
    const selectedOption = question?.options.find(opt => opt.text === optionText);
    
    // Calculate current scores based on new selection
    const newResponses = {
      ...responses,
      [questionId]: optionText,
    };
    
    // Calculate current attribute scores
    const currentScores = {
      Aa: 0,
      Ao: 0,
      Sc: 0,
      Inq: 0,
      DI: 0,
    };
    
    questions.forEach((q) => {
      const answer = newResponses[q.id];
      if (answer) {
        const option = q.options.find(opt => opt.text === answer);
        if (option && option.status && option.status !== 'None') {
          const status = option.status as keyof typeof currentScores;
          if (currentScores.hasOwnProperty(status)) {
            currentScores[status] = (currentScores[status] || 0) + 1;
          }
        }
      }
    });
    
    // Single compact log line that updates
    const answeredCount = Object.keys(newResponses).length;
    const attributeSummary = `Ao:${currentScores.Ao} DI:${currentScores.DI} Inq:${currentScores.Inq} Aa:${currentScores.Aa} Sc:${currentScores.Sc}`;
    console.log(`Q${question?.questionNumber}: "${optionText.substring(0, 30)}${optionText.length > 30 ? '...' : ''}" → ${selectedOption?.status || 'None'} | ${answeredCount}/50 | ${attributeSummary}`);
    
    setResponses(newResponses);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submit button clicked');
    console.log('All answered:', allAnswered);
    console.log('Answered count:', answeredCount);
    console.log('Total questions:', questions.length);
    console.log('Responses:', responses);

    // Check if all questions are answered
    if (!allAnswered) {
      const unanswered = questions.filter(q => !responses[q.id]);
      console.warn('Not all questions answered. Unanswered:', unanswered.map(q => q.questionNumber));
      setError(`Please answer all questions. ${questions.length - answeredCount} question(s) remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Calling onSubmit with responses:', responses);
      
      const submitHandler = getSubmitHandler();
      if (!submitHandler) {
        throw new Error('Submit handler is not available. Please refresh the page and try again.');
      }
      
      await submitHandler(responses);
      console.log('onSubmit completed successfully');
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(err.message || 'An error occurred while submitting the test.');
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full">
      {/* Fixed Header */}
      <div className="fixed-header bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="page-padding _100-width px-4 py-5">
          <div className="container-large container mx-auto max-w-7xl">
            <div className="heading-container relative mb-4">
              <h2 className="heading-large test-explainer text-2xl md:text-3xl font-semibold text-gray-900">
                Select the option that describes you the best
              </h2>
              <div className="info-wrapper absolute top-0 right-0">
                <div className="info-icon w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 cursor-help" title="Select the option that best describes you">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress_bar bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2.5 text-sm text-gray-600 font-medium">
                {answeredCount} of {questions.length} questions answered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Container */}
      <div className="questions-collection-container mt-32 pb-32 px-4">
        <div className="collection-list-wrapper">
          <div role="list" className="questions-container grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {questions.map((question) => {
              const selectedAnswer = responses[question.id];
              const isOption1Selected = selectedAnswer === question.options[0].text;
              const isOption2Selected = selectedAnswer === question.options[1].text;

              return (
                <div key={question.id} role="listitem" className="question_item w-dyn-item bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
                  <div className="question-wrapper">
                    <div className="number-container mb-4">
                      <h3 className="question-number text-lg font-semibold text-gray-900 mb-4">{question.questionNumber}.</h3>
                    </div>
                    <div className="question-options behaviour-response flex flex-col gap-3">
                      {/* Option 1 */}
                      <button
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, question.options[0].text)}
                        className={`option w-full inline-flex items-center justify-center px-5 py-3.5 rounded-lg border-2 transition-all text-left ${
                          isOption1Selected
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-md'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <h5 className="option-text text-sm font-medium w-full">{question.options[0].text}</h5>
                      </button>

                      {/* Option 2 */}
                      <button
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, question.options[1].text)}
                        className={`option w-full inline-flex items-center justify-center px-5 py-3.5 rounded-lg border-2 transition-all text-left ${
                          isOption2Selected
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-md'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <h5 className="option-text text-sm font-medium w-full">{question.options[1].text}</h5>
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
          <form id="wf-form-Behaviour-Response" onSubmit={handleSubmit} className="assessment-form-container">
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
          </form>
        </div>
      </div>
    </div>
  );
}
