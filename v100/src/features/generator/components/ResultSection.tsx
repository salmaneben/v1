import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormData } from '../types';
import { Input } from '@/components/ui/input';
import { useNotification } from '@/contexts/NotificationContext';
import perplexityService from '../utils/perplexityService';

interface ResultSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onGenerateKeywords: () => void;
  isGeneratingKeywords: boolean;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  formData,
  onInputChange,
  onGenerateKeywords: originalGenerateKeywords,
  isGeneratingKeywords: originalIsGenerating,
}) => {
  const [isGeneratingPerplexity, setIsGeneratingPerplexity] = useState(false);
  const [keywordCount, setKeywordCount] = useState(10);
  const { showNotification } = useNotification();

  // New function to generate keywords using Perplexity API
  const handleGenerateKeywords = async () => {
    if (!formData.topic) {
      showNotification('error', 'Please enter a topic before generating keywords');
      return;
    }
    
    setIsGeneratingPerplexity(true);
    
    try {
      // Generate keywords using the topic from form data
      const keywords = await perplexityService.generateKeywords(formData.topic, keywordCount);
      
      // Update the seoKeywords field with the generated keywords
      onInputChange('seoKeywords', keywords.join('\n'));
      
      showNotification('success', `Generated ${keywords.length} keywords successfully`);
    } catch (error) {
      console.error('Error generating keywords:', error);
      showNotification('error', error.message || 'Failed to generate keywords');
      
      // Fallback to original generator if Perplexity fails
      originalGenerateKeywords();
    } finally {
      setIsGeneratingPerplexity(false);
    }
  };

  // Determine if we're generating keywords (either with original or Perplexity)
  const isGeneratingKeywords = originalIsGenerating || isGeneratingPerplexity;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Target Audience *
        </label>
        <Textarea
          placeholder="Describe your target audience"
          value={formData.targetAudience}
          onChange={(e) => onInputChange('targetAudience', e.target.value)}
          className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          SEO Keywords
        </label>
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Enter SEO keywords (one per line)"
            value={formData.seoKeywords}
            onChange={(e) => onInputChange('seoKeywords', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500 w-full"
          />
          
          {/* Perplexity Keyword Generator */}
          <div className="flex flex-wrap gap-2 items-end">
            <div className="w-32">
              <label htmlFor="keywordCount" className="block text-xs font-medium text-gray-700 mb-1">
                Keyword Count
              </label>
              <Input
                id="keywordCount"
                type="number"
                min="5"
                max="50"
                value={keywordCount}
                onChange={(e) => setKeywordCount(parseInt(e.target.value) || 10)}
                disabled={isGeneratingKeywords}
                className="py-1.5"
              />
            </div>
            
            <Button
              type="button"
              onClick={handleGenerateKeywords}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isGeneratingKeywords || !formData.topic}
            >
              {isGeneratingKeywords ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : "Generate with Perplexity AI"}
            </Button>
            
            <p className="text-xs text-gray-500 mt-1 ml-2">
              Generate SEO keywords based on your topic using Perplexity AI
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            External Links *
          </label>
          <Textarea
            placeholder="Enter reference links (one per line)"
            value={formData.links}
            onChange={(e) => onInputChange('links', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Internal Links
          </label>
          <Textarea
            placeholder="Enter internal links (one per line)"
            value={formData.internalLinks}
            onChange={(e) => onInputChange('internalLinks', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};