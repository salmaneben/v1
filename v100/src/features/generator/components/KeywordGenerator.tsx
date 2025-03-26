import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import perplexityService from '../utils/perplexityService';
import { useNotification } from '@/contexts/NotificationContext';

interface KeywordGeneratorProps {
  topic: string;
  onKeywordsGenerated: (keywords: string[]) => void;
}

const KeywordGenerator: React.FC<KeywordGeneratorProps> = ({ 
  topic, 
  onKeywordsGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywordCount, setKeywordCount] = useState(10);
  const { showNotification } = useNotification();
  
  const handleGenerateKeywords = async () => {
    if (!topic) {
      showNotification('error', 'Please enter a topic before generating keywords');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const keywords = await perplexityService.generateKeywords(topic, keywordCount);
      onKeywordsGenerated(keywords);
      showNotification('success', `Generated ${keywords.length} keywords successfully`);
    } catch (error) {
      console.error('Error generating keywords:', error);
      showNotification('error', error.message || 'Failed to generate keywords');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="keywordCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Keywords
          </label>
          <Input
            id="keywordCount"
            type="number"
            min="5"
            max="50"
            value={keywordCount}
            onChange={(e) => setKeywordCount(parseInt(e.target.value) || 10)}
            disabled={isGenerating}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-blue-300 text-blue-600 hover:bg-blue-50 mb-0"
          disabled={isGenerating || !topic}
          onClick={handleGenerateKeywords}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Keywords"
          )}
        </Button>
      </div>
      <div className="text-xs text-gray-500">
        <p>Generate SEO-optimized keywords using Perplexity AI to improve your content visibility.</p>
      </div>
    </div>
  );
};

export default KeywordGenerator;