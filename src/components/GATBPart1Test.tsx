import { useState, useEffect, useRef } from 'react';
import TestTimer from './TestTimer';

interface Question {
  id: string;
  questionNumber: string;
  questionText: string;
  options: string[];
  correctAnswer?: string;
}

interface GATBPart1TestProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string>) => Promise<void>;
}

export default function GATBPart1Test({
  questions,
  onSubmit,
}: GATBPart1TestProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);
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
    setScore(newScore);
    
    // Console log after each answer
    if (Object.keys(responses).length > 0) {
      console.log(`📊 Current Score: ${newScore.correct}/${newScore.total} (${newScore.percentage}%)`);
    }
  }, [responses, questions]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setResponses((prev) => {
      const newResponses = {
        ...prev,
        [questionId]: answer,
      };
      return newResponses;
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
      const globalHandler = typeof window !== 'undefined' ? (window as any).gatbPart1SubmitHandler : null;
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
            testType: 'gatb-part-1',
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
          console.log('📊 GATB Part 1 - Test Results');
          console.log('═══════════════════════════════════════');
          console.log(`✅ Correct Answers: ${result.score.correctAnswers}`);
          console.log(`❌ Incorrect Answers: ${result.score.incorrectAnswers}`);
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`🎯 Score: ${result.score.score}/${result.score.totalQuestions}`);
          console.log(`📊 Percentage: ${result.score.percentage}%`);
          console.log('═══════════════════════════════════════');
        }

        window.location.href = '/tests/gatb-part-2-instructions';
      }
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

  // Parse question text to extract names
  const parseQuestionText = (text: string) => {
    // Format: "Name A: {nameA}\n\nName B: {nameB}\n\nAre these names the same or different?"
    const lines = text.split('\n').filter(l => l.trim());
    const nameALine = lines.find(l => l.startsWith('Name A:'));
    const nameBLine = lines.find(l => l.startsWith('Name B:'));
    
    const nameA = nameALine ? nameALine.replace('Name A:', '').trim() : '';
    const nameB = nameBLine ? nameBLine.replace('Name B:', '').trim() : '';
    
    return { nameA, nameB };
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Timer */}
      <TestTimer
        durationMinutes={6}
        onTimeUp={handleTimeUp}
        testName="GATB Part 1"
      />

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Choose if the names are same or different.
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
            const selectedAnswer = responses[question.id];
            const { nameA, nameB } = parseQuestionText(question.questionText);
            
            return (
              <div key={question.id}>
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Question Number */}
                    <span className="text-lg font-bold text-gray-900 flex-shrink-0">
                      {question.questionNumber}.
                    </span>

                    {/* Names */}
                    <div className="flex-1 flex items-center gap-2 text-gray-900">
                      <span className="font-medium">"{nameA}"</span>
                      <span className="text-gray-400">—</span>
                      <span className="font-medium">"{nameB}"</span>
                    </div>

                    {/* Answer Buttons */}
                    <div className="flex gap-3 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, 'Same')}
                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedAnswer === 'Same'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        Same
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnswerSelect(question.id, 'Different')}
                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedAnswer === 'Different'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        Different
                      </button>
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
            {isSubmitting ? 'Submitting...' : `Submit Test (${answeredCount}/${questions.length} answered)`}
          </button>
        </div>
      </form>
    </div>
  );
}

