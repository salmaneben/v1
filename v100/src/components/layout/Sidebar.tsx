import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Create a dummy SVG icon component for demonstration
const Icon = ({ name }) => {
  // Map of icon names to SVG paths
  const icons = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    generator: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
    ),
    templates: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    analytics: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
    help: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    apikey: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
      </svg>
    ),
    perplexity: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    collapse: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"></path>
      </svg>
    ),
    expand: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 17l5-5-5-5M6 17l5-5-5-5"></path>
      </svg>
    )
  };

  return icons[name] || null;
};

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tools');
  
  // Navigation structure with categories
  const navigation = {
    tools: [
      { name: 'Home', href: '/', icon: 'home' },
      { name: 'Generator', href: '/generator', icon: 'generator' },
      { name: 'Templates', href: '/templates', icon: 'templates' },
      { name: 'API Key Setup', href: '/api-setup', icon: 'apikey' },
      { name: 'Perplexity AI', href: '/perplexity', icon: 'perplexity' } // New Perplexity AI item
    ],
    help: [
      { name: 'Settings', href: '/settings', icon: 'settings' },
      { name: 'Help Center', href: '/help', icon: 'help' },
    ]
  };

  // Categories with labels
  const categories = {
    tools: 'Tools',
    help: 'Help & Settings'
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div 
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } transition-all duration-300 ease-in-out flex-shrink-0 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 shadow-sm h-full relative`}
    >
      <div className="h-full flex flex-col">
        {/* Main Navigation */}
        <div className="flex-grow overflow-y-auto py-4 px-3">
          {/* Logo or App Name */}
          <div className={`mb-6 px-3 py-2 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? (
              <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
            ) : (
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Content Generator
              </div>
            )}
          </div>
          
          <nav className="space-y-6">
            {Object.keys(navigation).map(category => (
              <div key={category} className="space-y-1">
                {!collapsed && (
                  <button 
                    onClick={() => toggleCategory(category)} 
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                  >
                    <span>{categories[category]}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${activeCategory === category ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                {(collapsed || activeCategory === category) && (
                  <div className="space-y-1">
                    {navigation[category].map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`group flex items-center ${
                            collapsed ? 'justify-center' : 'justify-between'
                          } px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-600'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className={`${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}>
                              <Icon name={item.icon} />
                            </span>
                            {!collapsed && <span className="ml-3">{item.name}</span>}
                          </div>
                          
                          {!collapsed && isActive && (
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer with version and collapse button */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <div className="text-xs text-gray-500">
              Version 1.0.0
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 ${collapsed ? 'mx-auto' : ''}`}
          >
            <Icon name={collapsed ? 'expand' : 'collapse'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;