import { useState } from 'react';

interface TestQuestionProps {
  questionNumber: number;
  questionText: string;
  questionImage?: string;
  options: string[];
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  required?: boolean;
}

export default function TestQuestion({
  questionNumber,
  questionText,
  questionImage,
  options,
  selectedAnswer,
  onAnswerSelect,
  required = true,
}: TestQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
          {questionNumber}
        </span>
        <div className="flex-1">
          <p className="text-gray-900 font-medium mb-3">{questionText}</p>
          {questionImage && (
            <img 
              src={questionImage} 
              alt={`Question ${questionNumber}`}
              className="max-w-full h-auto rounded-lg mb-4"
            />
          )}
        </div>
      </div>
      
      <div className="space-y-2 ml-12">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswerSelect(option)}
              className="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
              required={required}
            />
            <span className="text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}


