import { useState, useEffect, useRef } from 'react';

interface TestTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
  testName?: string;
}

export default function TestTimer({ durationMinutes, onTimeUp, testName = 'Test' }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Start the timer
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time is up
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          // Only trigger once
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setTimeout(() => {
              onTimeUp();
            }, 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show warning when less than 1 minute remaining
    if (timeLeft <= 60) {
      setIsWarning(true);
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update warning state
  useEffect(() => {
    if (timeLeft <= 60 && timeLeft > 0) {
      setIsWarning(true);
    } else if (timeLeft > 60) {
      setIsWarning(false);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / (durationMinutes * 60)) * 100;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div
        className={`bg-white rounded-lg shadow-2xl border-2 p-4 min-w-[140px] transition-all ${
          isWarning ? 'border-red-500 animate-pulse' : 'border-gray-300'
        }`}
      >
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-1">{testName}</div>
          <div
            className={`text-2xl font-bold mb-2 ${
              isWarning ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isWarning ? 'bg-red-500' : 'bg-primary-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {timeLeft === 0 && (
            <div className="text-xs text-red-600 font-medium mt-2">Time's Up!</div>
          )}
        </div>
      </div>
    </div>
  );
}

