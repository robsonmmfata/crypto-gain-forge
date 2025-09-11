import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '@/components/errorComp/ErrorComponent';

const ErrorDemo: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    console.log('Retrying...');
    // Simulate a retry action
    setTimeout(() => {
      alert('Retry completed!');
    }, 1000);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <ErrorComponent
        type="network"
        title="Demo: Network Error"
        message="This is a demonstration of the error component. In a real scenario, this would show when there's a network connectivity issue."
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        onGoBack={handleGoBack}
      />
    </div>
  );
};

export default ErrorDemo;
