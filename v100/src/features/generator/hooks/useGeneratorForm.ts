import { useState } from 'react';
import { FormData } from '../types';
import { hookTypes } from '../constants/hookTypes';
import { getArticleSize } from '../utils/articleSizes';

const initialFormData: FormData = {
  mainKeyword: '',
  country: 'United States',
  language: 'English (US)',
  wordCount: 'medium',
  targetAudience: '',
  links: '',
  internalLinks: '',
  faqs: '',
  seoKeywords: '',
  imageDetails: '',
  tone: 'Professional',
  hookType: 'Question',
  hookBrief: '',
};

interface UseGeneratorFormProps {
  onSubmit?: (formData: FormData) => void;
}

export const useGeneratorForm = ({ onSubmit }: UseGeneratorFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHookTypeChange = (hookType: string) => {
    const selectedHook = hookTypes.find((hook) => hook.type === hookType);
    setFormData((prev) => ({
      ...prev,
      hookType: hookType,
      hookBrief: selectedHook?.placeholder || '',
    }));
  };

  const generateSEOKeywords = async () => {
    if (!formData.mainKeyword) {
      alert('Please enter a main keyword first.');
      return;
    }

    setIsGeneratingKeywords(true);

    try {
      const perplexityApiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${perplexityApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an SEO expert. Generate a list of the 8 best SEO keywords for the given topic.',
            },
            {
              role: 'user',
              content: `Generate SEO keywords for: ${formData.mainKeyword}`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        handleInputChange('seoKeywords', data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return {
    formData,
    handleInputChange,
    handleHookTypeChange,
    generateSEOKeywords,
    handleSubmit,
    isGeneratingKeywords,
  };
};