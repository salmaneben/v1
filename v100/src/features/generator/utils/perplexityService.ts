// src/features/generator/utils/perplexityService.ts
const perplexityService = {
  // Get the API key from localStorage
  getApiKey: (): string | null => {
    return localStorage.getItem('perplexityApiKey');
  },
  
  // Check if the API key is set
  hasApiKey: (): boolean => {
    return !!localStorage.getItem('perplexityApiKey');
  }
};

export default perplexityService;