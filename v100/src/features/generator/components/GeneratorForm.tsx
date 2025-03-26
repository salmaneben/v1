// src/features/generator/components/GeneratorForm.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MainInfoSection } from './MainInfoSection';
import { HookSection } from './HookSection';
import { ResultSection } from './ResultSection';
import { useGeneratorForm } from '../hooks/useGeneratorForm';
import { generateKeywords } from '../utils/keywordService';
import { useNotification } from '@/contexts/NotificationContext';
import perplexityService from '../utils/perplexityService';
import TabSelector from '@/components/ui/tab-selector';
import PromptsPanel from './PromptsPanel';

interface GeneratorFormProps {
  onSubmit?: (formData: any) => void;
  isLoading?: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, isLoading = false }) => {
  const { showNotification } = useNotification ? useNotification() : { showNotification: () => {} };
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [generationMode, setGenerationMode] = useState('content'); // 'content' or 'prompt'
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  
  const {
    formData,
    handleInputChange,
    handleHookTypeChange,
    handleSubmit,
  } = useGeneratorForm({ onSubmit });

  // Function to generate SEO keywords using Perplexity API
  const generateSEOKeywords = async () => {
    // Check if topic exists
    if (!formData.topic) {
      showNotification && showNotification('error', 'Please enter a topic before generating keywords');
      return;
    }
    
    // Check if API key exists
    if (!perplexityService.hasApiKey()) {
      setShowApiKeyPrompt(true);
      showNotification && showNotification('error', 'Perplexity API key required for keyword generation');
      return;
    }
    
    setIsGeneratingKeywords(true);
    
    try {
      // Generate keywords based on the topic
      const keywords = await generateKeywords(formData.topic, 10);
      
      // Update the seoKeywords field in the form
      handleInputChange('seoKeywords', keywords.join('\n'));
      
      showNotification && showNotification('success', `Generated ${keywords.length} keywords successfully`);
    } catch (error) {
      console.error('Error generating keywords:', error);
      showNotification && showNotification('error', error.message || 'Failed to generate keywords');
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  // Function to generate content prompts
  const generatePrompts = async () => {
    // Check if topic exists
    if (!formData.topic) {
      showNotification && showNotification('error', 'Please enter a topic before generating prompts');
      return;
    }
    
    // Check if API key exists
    if (!perplexityService.hasApiKey()) {
      setShowApiKeyPrompt(true);
      showNotification && showNotification('error', 'Perplexity API key required for prompt generation');
      return;
    }
    
    setIsGeneratingPrompt(true);
    
    try {
      // Make request to Perplexity API
      const apiKey = perplexityService.getApiKey();
      const model = localStorage.getItem('perplexityModel') || 'sonar';
      
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
              content: "You are an expert content writer who generates creative and effective prompts for generating full articles."
            },
            {
              role: "user",
              content: `Generate 5 different prompts that I can use to create high-quality content about "${formData.topic}". 
              Target audience: ${formData.targetAudience || "General audience"}
              Each prompt should be detailed, specific, and designed to generate a complete article. 
              Format each prompt as a numbered list item, with a label description of what type of content it would generate.`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate prompts');
      }
      
      const data = await response.json();
      
      // Extract prompts from the response
      const promptsText = data.choices[0].message.content.trim();
      
      // Parse numbered prompts
      const promptRegex = /(\d+)\.\s+(.*?):\s+(.*?)(?=\n\d+\.|\n*$)/gs;
      const matches = [...promptsText.matchAll(promptRegex)];
      
      const parsedPrompts = matches.map(match => {
        const type = match[2].trim();
        const prompt = match[3].trim();
        return `${type}: ${prompt}`;
      });
      
      setGeneratedPrompts(parsedPrompts.length > 0 ? parsedPrompts : promptsText.split('\n\n'));
      showNotification && showNotification('success', 'Generated content prompts successfully');
    } catch (error) {
      console.error('Error generating prompts:', error);
      showNotification && showNotification('error', error.message || 'Failed to generate prompts');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Content Generator
          </CardTitle>
          
          <TabSelector 
            options={[
              { 
                id: 'content', 
                label: 'Generate Content',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              { 
                id: 'prompts', 
                label: 'Generate Prompts',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                )
              }
            ]}
            value={generationMode}
            onChange={setGenerationMode}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {showApiKeyPrompt ? (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <h3 className="font-medium text-lg text-blue-800 mb-2">Perplexity API Key Required</h3>
            <p className="text-blue-600 mb-4">
              To use the AI generation features, you need to add your Perplexity API key.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => setShowApiKeyPrompt(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  window.location.href = '/perplexity';
                }}
              >
                Add API Key
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Common form sections */}
            <div className="space-y-6 mb-6">
              <MainInfoSection 
                formData={formData}
                onInputChange={handleInputChange}
              />
              
              <HookSection
                formData={formData}
                onInputChange={handleInputChange}
                onHookTypeChange={handleHookTypeChange}
              />
            </div>
            
            {generationMode === 'content' ? (
              // Content generation mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <ResultSection 
                  formData={formData}
                  onInputChange={handleInputChange}
                  onGenerateKeywords={generateSEOKeywords}
                  isGeneratingKeywords={isGeneratingKeywords}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating Content...' : 'Generate Full Content'}
                </Button>
              </form>
            ) : (
              // Prompt generation mode
              <div className="space-y-6">
                <PromptsPanel 
                  prompts={generatedPrompts}
                  isGenerating={isGeneratingPrompt}
                  onGenerate={generatePrompts}
                  topic={formData.topic}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratorForm;