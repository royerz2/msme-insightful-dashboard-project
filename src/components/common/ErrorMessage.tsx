
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  useDummyData?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, useDummyData }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      {useDummyData ? (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-md">
          <p className="font-semibold">⚠️ Using Demo Data</p>
          <p className="text-sm">API connection failed. Showing sample data for demonstration purposes.</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{message}</p>
        </>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
