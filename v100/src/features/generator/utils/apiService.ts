// Google API service utility
const apiService = {
    // Get the API key from localStorage
    getApiKey: (): string | null => {
      return localStorage.getItem('googleApiKey');
    },
    
    // Check if the API key is set
    hasApiKey: (): boolean => {
      return !!localStorage.getItem('googleApiKey');
    },
    
    // Make a request to the Google API
    makeRequest: async (prompt: string, options: any = {}) => {
      const apiKey = apiService.getApiKey();
      
      if (!apiKey) {
        throw new Error('API key not found. Please add your Google API key in settings.');
      }
      
      try {
        // This is a placeholder for the actual API call
        // Replace with your specific Google API endpoint and parameters
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`  // Fixed: Added backticks around the template string
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ],
            generationConfig: {
              temperature: options.temperature || 0.7,
              topK: options.topK || 40,
              topP: options.topP || 0.95,
              maxOutputTokens: options.maxTokens || 1024,
            }
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to generate content');
        }
        
        return await response.json();
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    }
  };
  
  export default apiService;