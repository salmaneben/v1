import React from 'react';
import { Input } from '@/components/ui/input';
import { FormData } from '../types';

interface MainInfoSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export const MainInfoSection: React.FC<MainInfoSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Main Keyword *
        </label>
        <Input
          placeholder="Enter main keyword"
          value={formData.mainKeyword}
          onChange={(e) => onInputChange('mainKeyword', e.target.value)}
          className="focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          Content Tone
        </label>
        <select
          value={formData.tone}
          onChange={(e) => onInputChange('tone', e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="None">None</option>
          <option value="Friendly">Friendly</option>
          <option value="Professional">Professional</option>
          <option value="Informational">Informational</option>
          <option value="Transactional">Transactional</option>
          <option value="Inspirational">Inspirational</option>
          <option value="Neutral">Neutral</option>
          <option value="Witty">Witty</option>
          <option value="Casual">Casual</option>
          <option value="Authoritative">Authoritative</option>
          <option value="Encouraging">Encouraging</option>
          <option value="Persuasive">Persuasive</option>
          <option value="Poetic">Poetic</option>
        </select>
      </div>
    </div>
  );
};