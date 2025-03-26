// src/features/generator/components/PromptsPanel.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PromptsPanelProps {
  prompts: string[];
  isGenerating: boolean;
  onGenerate: () => void;
  topic: string;
}

const PromptsPanel: React.FC<PromptsPanelProps> = ({
  prompts,
  isGenerating,
  onGenerate,
  topic
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Prompt copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Content Prompts</h3>
        <Button
          onClick={onGenerate}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          disabled={isGenerating || !topic}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Prompts...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              Generate Prompts with Perplexity
            </span>
          )}
        </Button>
      </div>
      
      {prompts.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click on any prompt below to copy it to your clipboard.
          </p>
          <div className="grid gap-4">
            {prompts.map((prompt, index) => (
              <Card 
                key={index} 
                className="p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => copyToClipboard(prompt)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 whitespace-pre-line">{prompt}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Prompts Generated Yet</h3>
          <p className="text-gray-500 mb-4">
            Enter a topic and click "Generate Prompts" to create content prompts using Perplexity AI.
          </p>
          <p className="text-sm text-gray-500">
            These prompts can be used with any AI tool to create high-quality content.
          </p>
        </div>
      )}
      
      {prompts.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allPrompts = prompts.join('\n\n');
              const blob = new Blob([allPrompts], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `content-prompts-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Download All Prompts
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromptsPanel;