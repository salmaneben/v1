import React, { useEffect, useState } from 'react';
import { GeneratorForm } from '@/features/generator';
import { Card } from '@/components/ui/card';
import ApiKeyManager from '@/components/ApiKeyManager';
import apiService from '@/features/generator/utils/apiService';

const Generator = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    // Check if API key is available
    const checkApiKey = () => {
      setHasApiKey(apiService.hasApiKey());
    };
    
    checkApiKey();
    
    // Listen for changes to the API key
    window.addEventListener('storage', checkApiKey);
    window.addEventListener('apiKeyChanged', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
      window.removeEventListener('apiKeyChanged', checkApiKey);
    };
  }, []);
  
  const handleGenerate = async (formData: any) => {
    try {
      // Handle form submission
      console.log('Generating content with:', formData);
      
      // Here you would call the API service with formData
      // const response = await apiService.makeRequest(...);
      
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Content Generator
        </h1>
      </div>

      <Card className="p-6">
        {hasApiKey ? (
          <GeneratorForm onSubmit={handleGenerate} />
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">API Key Required</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              To use the content generator, you need to add your Google API key first.
            </p>
            <ApiKeyManager />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Generator;