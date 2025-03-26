// src/components/ui/tab-selector.tsx
import React from 'react';

interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabSelectorProps {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex rounded-lg border overflow-hidden ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            value === option.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;