import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/contexts/NotificationContext';

const ApiKeyManager = () => {
  const { showNotification } = useNotification();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saveLocally, setSaveLocally] = useState(false);
  
  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem('googleApiKey');
    if (storedKey) {
      setSavedKey(storedKey);
      setApiKey(storedKey);
      setIsKeyValid(true);
    }
  }, []);

  // Validate API key
  const validateApiKey = async (key) => {
    setIsChecking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll consider any key 20+ chars as valid
      const valid = key && key.length >= 20;
      setIsKeyValid(valid);
      
      if (valid) {
        if (saveLocally) {
          localStorage.setItem('googleApiKey', key);
          setSavedKey(key);
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new Event('apiKeyChanged'));
        }
        
        showNotification('success', 'API key successfully connected!');
      } else {
        showNotification('error', 'Invalid API key format. Please check your key.');
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setIsKeyValid(false);
      showNotification('error', error.message || 'Failed to validate API key.');
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
    localStorage.removeItem('googleApiKey');
    window.dispatchEvent(new Event('apiKeyChanged'));
    showNotification('info', 'API key has been removed.');
  };

  // Mask API key for display
  const maskApiKey = (key) => {
    if (!key) return '';
    if (showKey) return key;
    return key.substring(0, 4) + '•'.repeat(Math.max(0, key.length - 8)) + key.substring(key.length - 4);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Google API Integration</CardTitle>
        <CardDescription className="text-blue-100">
          Enter your Google API key to unlock AI-powered content generation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {savedKey ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-800">API Key Connected</p>
                <p className="text-sm text-blue-600 font-mono mt-1">{maskApiKey(savedKey)}</p>
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
                Google API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google API key"
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
                Your API key is used locally and never stored on our servers.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="saveLocally"
                checked={saveLocally}
                onChange={() => setSaveLocally(!saveLocally)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="saveLocally" className="text-sm text-gray-600">
                Remember API key on this device
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
          <h3 className="font-medium text-gray-900 mb-4">What you can do with Google API:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate SEO Content</p>
                <p className="text-sm text-gray-600">Create optimized articles and blog posts</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Language Translation</p>
                <p className="text-sm text-gray-600">Translate content to multiple languages</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Image Analysis</p>
                <p className="text-sm text-gray-600">Extract text and context from images</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Sentiment Analysis</p>
                <p className="text-sm text-gray-600">Analyze tone and sentiment of content</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 rounded-b-lg border-t border-gray-100 flex justify-between items-center">
        <p className="text-xs text-gray-500">Need an API key? <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Get one from Google Cloud Console</a></p>
        
        <a href="#" className="text-xs text-blue-600 hover:text-blue-800">Learn more about API usage</a>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyManager;