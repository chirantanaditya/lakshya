import { useState, useEffect, useRef } from 'react';
import TestTimer from './TestTimer';

interface Question {
  id: string;
  number: string;
  imageUrl: string;
  part: number;
}

interface Match {
  leftIndex: number;
  rightIndex: number;
  questionId: string;
}

interface GATBPart7TestProps {
  questions: Question[];
  part: number;
  totalParts: number;
  onSubmit?: (matches: Match[], part: number) => void | Promise<void>; // Optional, can use global handler
}

export default function GATBPart7Test({
  questions,
  part,
  totalParts,
  onSubmit,
}: GATBPart7TestProps) {
  const [leftShapes, setLeftShapes] = useState<string[]>([]);
  const [rightShapes, setRightShapes] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeftIndex, setSelectedLeftIndex] = useState<number | null>(null);
  const [selectedRightIndex, setSelectedRightIndex] = useState<number | null>(null);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]); // For undo functionality
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoSubmittedRef = useRef(false);

  // Log matches count whenever matches change
  useEffect(() => {
    if (matches.length > 0) {
      const total = leftShapes.length;
      const percentage = total > 0 ? Math.round((matches.length / total) * 100) : 0;
      console.log(`📊 GATB Part 7 (Part ${part}) - Current Matches: ${matches.length}/${total} (${percentage}%)`);
    }
  }, [matches, leftShapes.length, part]);

  // Initialize shapes from question images
  useEffect(() => {
    // Each question image URL will be used for both left and right
    // In a real scenario, you might need to extract left/right shapes from composite images
    // For now, we'll use the images directly and create matching pairs
    
    const left = questions.map(q => q.imageUrl);
    
    // Create right shapes (shuffled version of left for matching game)
    const shuffle = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    setLeftShapes(left);
    setRightShapes(shuffle([...left]));
  }, [questions]);

  const handleLeftShapeClick = (index: number) => {
    if (selectedLeftIndex === index) {
      setSelectedLeftIndex(null);
    } else {
      setSelectedLeftIndex(index);
      setSelectedRightIndex(null);
    }
  };

  const handleRightShapeClick = (index: number) => {
    if (selectedLeftIndex === null) {
      return; // Must select left shape first
    }

    // Check if right shape is already matched
    const isAlreadyMatched = matches.some(m => m.rightIndex === index);
    if (isAlreadyMatched) {
      return;
    }

    // Check if left shape is already matched
    const isLeftMatched = matches.some(m => m.leftIndex === selectedLeftIndex);
    if (isLeftMatched) {
      setSelectedLeftIndex(null);
      return;
    }

    // Create match
    const newMatch: Match = {
      leftIndex: selectedLeftIndex,
      rightIndex: index,
      questionId: questions[selectedLeftIndex]?.id || '',
    };

    setMatches((prev) => [...prev, newMatch]);
    setMatchHistory((prev) => [...prev, newMatch]);
    setSelectedLeftIndex(null);
    setSelectedRightIndex(null);
    setError(null);
  };

  const handleUndo = () => {
    if (matchHistory.length === 0) return;

    const lastMatch = matchHistory[matchHistory.length - 1];
    setMatches((prev) => prev.filter(
      (m) => !(m.leftIndex === lastMatch.leftIndex && m.rightIndex === lastMatch.rightIndex)
    ));
    setMatchHistory((prev) => prev.slice(0, -1));
    setSelectedLeftIndex(null);
    setSelectedRightIndex(null);
  };

  const handleSubmit = async (e?: React.FormEvent, forceSubmit = false) => {
    if (e) {
      e.preventDefault();
    }

    // Prevent multiple submissions
    if (isSubmitting || hasAutoSubmittedRef.current) {
      return;
    }

    // Check if all shapes are matched (unless force submit)
    if (!forceSubmit) {
      if (matches.length < leftShapes.length) {
        setError(`Please match all shapes. ${matches.length}/${leftShapes.length} matches completed.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);
    hasAutoSubmittedRef.current = true;

    try {
      // Try to use global handler first, then fallback to prop, then direct submission
      const globalHandler = typeof window !== 'undefined' ? (window as any).gatbPart7SubmitHandler : null;
      const submitHandler = globalHandler || onSubmit;
      
      if (submitHandler) {
        await submitHandler(matches, part);
      } else {
        // Direct submission fallback
        const response = await fetch('/api/tests/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testType: 'gatb-part-7',
            part: part,
            matches: matches,
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
          console.log(`📊 GATB Part 7 - Part ${part} Results`);
          console.log('═══════════════════════════════════════');
          console.log(`✅ Matched: ${result.score.matched}`);
          console.log(`📈 Total Questions: ${result.score.totalQuestions}`);
          console.log(`🎯 Score: ${result.score.matched}/${result.score.totalQuestions}`);
          console.log('═══════════════════════════════════════');
        }

        // If this is the last part, redirect to dashboard
        // Otherwise, move to next part
        if (part >= totalParts) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = `/tests/gatb-part-7?part=${part + 1}`;
        }
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

  const isLeftMatched = (index: number) => {
    return matches.some(m => m.leftIndex === index);
  };

  const isRightMatched = (index: number) => {
    return matches.some(m => m.rightIndex === index);
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Timer */}
      <TestTimer
        durationMinutes={7}
        onTimeUp={handleTimeUp}
        testName={`GATB Part 7 (${part}/${totalParts})`}
      />

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Match the shapes from both sides.
        </h1>
      </div>

      {/* Part Indicator and Controls */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-700">
          Part {part} of {totalParts}
        </div>
        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={handleUndo}
            disabled={matchHistory.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Undo Your Last Selection
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Shape Panels */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Active Shapes */}
          <div className="bg-white rounded-lg p-6 border-4 border-green-500 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Left Side</h2>
            <div className="grid grid-cols-5 gap-3">
              {leftShapes.map((imageUrl, index) => {
                const isSelected = selectedLeftIndex === index;
                const isMatched = isLeftMatched(index);
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLeftShapeClick(index)}
                    disabled={isMatched}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      isMatched
                        ? 'border-green-500 bg-green-50 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-300'
                        : 'border-black bg-white hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Left shape ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Target Shapes */}
          <div className="bg-white rounded-lg p-6 border-4 border-green-300 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Right Side</h2>
            <div className="grid grid-cols-5 gap-3">
              {rightShapes.map((imageUrl, index) => {
                const isSelected = selectedRightIndex === index;
                const isMatched = isRightMatched(index);
                const canSelect = selectedLeftIndex !== null && !isMatched;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRightShapeClick(index)}
                    disabled={isMatched || selectedLeftIndex === null}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      isMatched
                        ? 'border-green-500 bg-green-50 opacity-60 cursor-not-allowed'
                        : canSelect
                        ? 'border-gray-400 bg-gray-50 hover:border-green-400 hover:bg-green-50 cursor-pointer'
                        : selectedLeftIndex === null
                        ? 'border-gray-300 bg-gray-50 opacity-75 cursor-not-allowed'
                        : 'border-gray-300 bg-gray-50 opacity-75'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Right shape ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting || matches.length < leftShapes.length}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : `Submit Part ${part} (${matches.length}/${leftShapes.length} matched)`}
          </button>
        </div>
      </form>
    </div>
  );
}

