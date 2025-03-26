// src/pages/PerplexityTool.tsx
import React, { useState, useEffect } from 'react';
import PerplexityApiManager from '@/components/PerplexityApiManager';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/contexts/NotificationContext';

const PerplexityTool = () => {
  const { showNotification } = useNotification ? useNotification() : { showNotification: () => {} };
  const [hasApiKey, setHasApiKey] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [temperature, setTemperature] = useState(0.7);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [promptTemplates, setPromptTemplates] = useState([
    { name: 'SEO Keywords', prompt: 'Generate 10 SEO-optimized keywords for a blog post about: {topic}' },
    { name: 'Blog Outline', prompt: 'Create a detailed outline for a blog post about: {topic}' },
    { name: 'Product Description', prompt: 'Write a compelling product description for: {topic}' },
    { name: 'Social Media Post', prompt: 'Create an engaging social media post about: {topic}' },
  ]);
  
  // Check if Perplexity API key exists
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('perplexityApiKey');
      setHasApiKey(!!apiKey);
    };
    
    checkApiKey();
    
    // Listen for changes to the API key
    window.addEventListener('perplexityApiKeyChanged', checkApiKey);
    window.addEventListener('storage', checkApiKey);
    
    return () => {
      window.removeEventListener('perplexityApiKeyChanged', checkApiKey);
      window.removeEventListener('storage', checkApiKey);
    };
  }, []);
  
  // Generate response using Perplexity API
  const generateResponse = async () => {
    if (!prompt.trim()) {
      showNotification && showNotification('error', 'Please enter a prompt first');
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const apiKey = localStorage.getItem('perplexityApiKey');
      const model = localStorage.getItem('perplexityModel') || 'sonar';
      
      if (!apiKey) {
        throw new Error('No API key found. Please add your Perplexity API key first.');
      }
      
      // Prepare request body
      const requestBody = {
        model: model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: temperature,
        max_tokens: maxTokens
      };
      
      // Add web search options if enabled and using Sonar model
      if (enableWebSearch && model === 'sonar') {
        requestBody.web_search_options = {
          search_context_size: "high"
        };
      }
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate response');
      }
      
      const data = await response.json();
      setResponse(data.choices[0].message.content);
      
    } catch (error) {
      console.error('Error generating response:', error);
      showNotification && showNotification('error', error.message || 'Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply a prompt template
  const applyTemplate = (templatePrompt) => {
    const filledPrompt = templatePrompt.replace('{topic}', '');
    setPrompt(filledPrompt);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Perplexity AI Tools</h1>
      
      {hasApiKey ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Prompt Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">Prompt Builder</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quick Prompts
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {promptTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-xs h-auto py-1.5 justify-start normal-case"
                        onClick={() => applyTemplate(template.prompt)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Prompt
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here..."
                    className="min-h-[200px] focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Temperature ({temperature})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1.9"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Tokens
                    </label>
                    <Input
                      type="number"
                      min="100"
                      max="4000"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1000)}
                      className="focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="webSearch"
                    checked={enableWebSearch}
                    onChange={() => setEnableWebSearch(!enableWebSearch)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="webSearch" className="text-sm text-gray-600">
                    Enable web search (for Sonar model)
                  </label>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={generateResponse}
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : "Generate Response"}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gray-50 border-b px-6 py-4">
                <CardTitle className="text-lg font-medium text-gray-800">API Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setHasApiKey(false)}
                >
                  Change API Key or Model
                </Button>
                <p className="mt-3 text-xs text-gray-500">
                  Current model: {localStorage.getItem('perplexityModel') || 'sonar'}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  <a 
                    href="https://docs.perplexity.ai/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    View API documentation
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Response */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-md h-full overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b px-6 py-4">
                <CardTitle className="text-lg font-medium text-gray-800">Response</CardTitle>
              </CardHeader>
              <CardContent className="p-6 overflow-auto" style={{ minHeight: "400px", maxHeight: "700px" }}>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Generating your response...</p>
                  </div>
                ) : response ? (
                  <div className="prose max-w-none">
                    {response.split('\n').map((paragraph, index) => {
                      // Handle markdown headings
                      if (paragraph.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.substring(2)}</h1>;
                      } else if (paragraph.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{paragraph.substring(3)}</h2>;
                      } else if (paragraph.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{paragraph.substring(4)}</h3>;
                      } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                        return <li key={index} className="ml-6 list-disc">{paragraph.substring(2)}</li>;
                      } else if (paragraph.match(/^\d+\.\s/)) {
                        return <li key={index} className="ml-6 list-decimal">{paragraph.substring(paragraph.indexOf(' ') + 1)}</li>;
                      } else if (paragraph.trim() === '') {
                        return <div key={index} className="h-4"></div>;
                      } else {
                        return <p key={index} className="mb-3 text-gray-700">{paragraph}</p>;
                      }
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="mt-4 text-gray-500">Enter a prompt and click "Generate Response" to see results here.</p>
                    <p className="mt-2 text-gray-400 text-sm">Try one of the quick prompts to get started!</p>
                  </div>
                )}
              </CardContent>
              
              {response && (
                <div className="border-t p-4 bg-gray-50 flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(response);
                      showNotification && showNotification('success', 'Response copied to clipboard');
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      const blob = new Blob([response], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `perplexity-response-${new Date().toISOString().slice(0,10)}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    Download
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <PerplexityApiManager />
        </div>
      )}
    </div>
  );
};

export default PerplexityTool;