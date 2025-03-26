import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import apiService from '@/features/generator/utils/apiService';

// Define navigation items for the header tools menu
const navigationItems = [
  { name: 'Content Generator', href: '/generator', description: 'Create AI-powered content' },
  { name: 'Templates', href: '/templates', description: 'Pre-made content templates' },
  { name: 'API Setup', href: '/api-setup', description: 'Configure your Google API key' },
  { name: 'Settings', href: '/settings', description: 'Customize your preferences' },
  { name: 'Help', href: '/help', description: 'Documentation and support' }
];

interface HeaderProps {
  showTools?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showTools = false }) => {
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Check if API key exists in localStorage
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('googleApiKey');
      setHasApiKey(!!apiKey);
    };
    
    checkApiKey();
    
    // Listen for changes to the API key
    window.addEventListener('storage', checkApiKey);
    window.addEventListener('apiKeyChanged', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
      window.removeEventListener('apiKeyChanged', checkApiKey);
    };
  }, []);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Content Generator</span>
          </Link>
          
          {/* Show navigation in header when on home page */}
          {showTools && (
            <nav className="hidden md:flex space-x-6">
              {navigationItems.slice(0, 3).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {hasApiKey ? (
            <Link to="/generator">
              <Button size="sm">Create Content</Button>
            </Link>
          ) : (
            <Link to="/api-setup">
              <Button variant="gradient" size="sm">
                Add API Key
              </Button>
            </Link>
          )}
          <Link to="/help">
            <Button variant="outline" size="sm">
              Documentation
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;