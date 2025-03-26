// src/features/generator/utils/keywordService.ts
import perplexityService from './perplexityService';

export const generateKeywords = async (topic: string, count: number = 10): Promise<string[]> => {
  try {
    // Check if API key exists
    if (!perplexityService.hasApiKey()) {
      throw new Error('No API key found. Please add your Perplexity API key first.');
    }
    
    const apiKey = perplexityService.getApiKey();
    const model = localStorage.getItem('perplexityModel') || 'sonar';
    
    // Make request to Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an SEO keyword expert. Generate only keywords, one per line, no numbering or additional text."
          },
          {
            role: "user",
            content: `Generate ${count} SEO-optimized keywords related to "${topic}". Return only the keywords, one per line, with no numbering or additional text.`
          }
        ],
        temperature: 0.4,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate keywords');
    }
    
    const data = await response.json();
    
    // Extract keywords from the response
    const keywordsText = data.choices[0].message.content.trim();
    const keywords = keywordsText
      .split('\n')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword && !keyword.match(/^(\d+\.|\*|\-)/)); // Remove any numbering or bullet points
    
    return keywords;
  } catch (error) {
    console.error('Error generating keywords:', error);
    throw error;
  }
};