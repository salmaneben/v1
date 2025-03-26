// src/components/PerplexityApiManager.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/contexts/NotificationContext';

const PerplexityApiManager = () => {
  const { showNotification } = useNotification ? useNotification() : { showNotification: () => {} };
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saveLocally, setSaveLocally] = useState(true);
  const [selectedModel, setSelectedModel] = useState('sonar');
  
  // Available Perplexity models - updated based on latest API documentation
  const models = [
    { id: 'sonar', name: 'Sonar', description: 'Default model with web search capabilities' },
    { id: 'mistral-7b-instruct', name: 'Mistral 7B Instruct', description: 'Balanced performance and speed' },
    { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', description: 'Advanced instruction-following model' },
    { id: 'codellama-70b-instruct', name: 'CodeLlama 70B Instruct', description: 'Specialized for code generation' },
    { id: 'llama-3-70b-instruct', name: 'Llama 3 70B Instruct', description: 'Meta\'s latest large language model' }
  ];
  
  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('perplexityApiKey');
    const storedModel = localStorage.getItem('perplexityModel');
    
    if (storedKey) {
      setSavedKey(storedKey);
      setApiKey(storedKey);
      setIsKeyValid(true);
    }
    
    if (storedModel) {
      // Check if the stored model is still valid, otherwise use default
      if (models.some(model => model.id === storedModel)) {
        setSelectedModel(storedModel);
      } else {
        setSelectedModel('sonar');
        localStorage.setItem('perplexityModel', 'sonar');
      }
    }
  }, []);

  // Test the API key with a simple request
  const validateApiKey = async (key) => {
    setIsChecking(true);
    
    try {
      // Make a simple request to the Perplexity API
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "user",
              content: "Test message to validate API key. Respond with 'API key is valid'."
            }
          ],
          temperature: 0.2,
          max_tokens: 20
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API key validation failed');
      }
      
      setIsKeyValid(true);
      
      if (saveLocally) {
        localStorage.setItem('perplexityApiKey', key);
        localStorage.setItem('perplexityModel', selectedModel);
        setSavedKey(key);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('perplexityApiKeyChanged'));
      }
      
      showNotification && showNotification('success', 'Perplexity API key successfully validated!');
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsKeyValid(false);
      showNotification && showNotification('error', error.message || 'Failed to validate API key.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateApiKey(apiKey);
  };

  const handleClear = () => {
    setApiKey('');
    setSavedKey('');
    setIsKeyValid(false);
    localStorage.removeItem('perplexityApiKey');
    localStorage.removeItem('perplexityModel');
    window.dispatchEvent(new Event('perplexityApiKeyChanged'));
    showNotification && showNotification('info', 'Perplexity API key has been removed.');
  };

  // Mask API key for display
  const maskApiKey = (key) => {
    if (!key) return '';
    if (showKey) return key;
    return key.substring(0, 4) + '•'.repeat(Math.max(0, key.length - 8)) + key.substring(key.length - 4);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="space-y-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <CardTitle className="text-2xl font-bold">Perplexity AI Integration</CardTitle>
        </div>
        <CardDescription className="text-purple-100">
          Enter your Perplexity API key to unlock advanced AI-powered features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {savedKey ? (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-medium text-purple-800">API Key Connected</p>
                </div>
                <p className="text-sm text-purple-600 font-mono mt-1">{maskApiKey(savedKey)}</p>
                
                <div className="mt-3">
                  <p className="text-xs text-gray-600">Selected Model:</p>
                  <p className="text-sm font-medium">{models.find(m => m.id === selectedModel)?.name || selectedModel}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs"
                >
                  {showKey ? 'Hide' : 'Show'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClear}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium text-gray-700 block">
                Perplexity API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Perplexity API key"
                  className="pr-12 font-mono"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Select Model
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedModel === model.id 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="model"
                        checked={selectedModel === model.id}
                        onChange={() => setSelectedModel(model.id)}
                        className="text-purple-600"
                      />
                      <span className="font-medium text-sm">{model.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">{model.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="saveLocally"
                checked={saveLocally}
                onChange={() => setSaveLocally(!saveLocally)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="saveLocally" className="text-sm text-gray-600">
                Remember API key on this device
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isChecking || apiKey.length < 10}
            >
              {isChecking ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </span>
              ) : "Connect API Key"}
            </Button>
          </form>
        )}
        
        {/* Features Section */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="font-medium text-gray-900 mb-4">What you can do with Perplexity AI:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">SEO Keyword Generation</p>
                <p className="text-sm text-gray-600">Create optimized keywords for your content</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Real-time Web Search</p>
                <p className="text-sm text-gray-600">Access up-to-date information with Sonar model</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Content Rewriting</p>
                <p className="text-sm text-gray-600">Transform and improve existing content</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Research Assistance</p>
                <p className="text-sm text-gray-600">Gather information for articles and reports</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between items-center flex-wrap gap-3">
        <div className="text-xs text-gray-500">
          <span>Need an API key? </span>
          <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 font-medium">
            Get one from Perplexity AI
          </a>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>API Usage: </span>
          <a href="https://docs.perplexity.ai/docs" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
            Documentation
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PerplexityApiManager;