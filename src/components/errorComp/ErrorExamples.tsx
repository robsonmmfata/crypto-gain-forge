import React from 'react';
import ErrorComponent from './ErrorComponent';

// Example usage component to demonstrate different error types
const ErrorExamples: React.FC = () => {
  const handleRetry = () => {
    console.log('Retrying...');
    // Add your retry logic here
  };

  const handleGoHome = () => {
    console.log('Going home...');
    // Add navigation logic here
  };

  const handleGoBack = () => {
    console.log('Going back...');
    // Add navigation logic here
  };

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Error Component Examples</h1>

      {/* 404 Error Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">404 - Page Not Found</h2>
        <div className="h-96">
          <ErrorComponent
            type="404"
            onGoHome={handleGoHome}
            onGoBack={handleGoBack}
          />
        </div>
      </div>

      {/* 500 Error Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">500 - Server Error</h2>
        <div className="h-96">
          <ErrorComponent
            type="500"
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        </div>
      </div>

      {/* Network Error Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Network Error</h2>
        <div className="h-96">
          <ErrorComponent
            type="network"
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        </div>
      </div>

      {/* Auth Error Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Authentication Error</h2>
        <div className="h-96">
          <ErrorComponent
            type="auth"
            onGoHome={handleGoHome}
          />
        </div>
      </div>

      {/* Custom Error Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Custom Error</h2>
        <div className="h-96">
          <ErrorComponent
            type="generic"
            title="Custom Error Title"
            message="This is a custom error message that you can provide."
            onRetry={handleRetry}
            onGoHome={handleGoHome}
            onGoBack={handleGoBack}
          />
        </div>
      </div>

      {/* Minimal Error Example */}
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Minimal Error (Only Home Button)</h2>
        <div className="h-96">
          <ErrorComponent
            type="generic"
            showRetry={false}
            showBack={false}
            onGoHome={handleGoHome}
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorExamples;
