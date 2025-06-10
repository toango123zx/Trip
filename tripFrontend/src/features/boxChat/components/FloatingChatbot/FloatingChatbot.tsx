import React, { useState } from 'react';

interface FloatingChatbotProps {
  onToggleChatbot: () => void;
  isChatbotActive: boolean;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({
  onToggleChatbot,
  isChatbotActive
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Tooltip */}
      {isHovered && !isChatbotActive && (
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          Chat với AI Assistant
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={onToggleChatbot}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-16 h-16 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          isChatbotActive
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
      >
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isChatbotActive ? (
            // Close icon
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Robot icon
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9l-5.09 3.74L18 22l-6-4.5L6 22l1.09-9.26L2 9l6.91-.74L12 2z"/>
            </svg>
          )}
        </div>

        {/* Pulse animation when not active */}
        {!isChatbotActive && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
        )}

        {/* Online indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </button>
    </div>
  );
};