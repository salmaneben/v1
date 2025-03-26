import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Home from '@/pages/Home';
import Generator from '@/pages/Generator';
import ApiKeyManager from '@/components/ApiKeyManager';
import PerplexityTool from '@/pages/PerplexityTool';  // Import the new component

// Create a layout component that conditionally renders the sidebar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Only show sidebar on non-home pages
  const isHomePage = location.pathname === "/";

  // Function to handle sidebar state changes
  const handleSidebarChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header showTools={isHomePage} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only show if not on home page */}
        {!isHomePage && <Sidebar onToggle={handleSidebarChange} />}

        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AppLayout>
            <Home />
          </AppLayout>
        } />
        <Route path="/generator" element={
          <AppLayout>
            <Generator />
          </AppLayout>
        } />
        <Route path="/api-setup" element={
          <AppLayout>
            <div className="max-w-4xl mx-auto py-8">
              <h1 className="text-3xl font-bold mb-8">API Key Setup</h1>
              <ApiKeyManager />
            </div>
          </AppLayout>
        } />
        {/* New Perplexity Tool Route */}
        <Route path="/perplexity" element={
          <AppLayout>
            <PerplexityTool />
          </AppLayout>
        } />
        <Route path="/templates" element={
          <AppLayout>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">Templates</h1>
              <p className="mt-4 text-gray-600">Template library coming soon...</p>
            </div>
          </AppLayout>
        } />
        <Route path="/settings" element={
          <AppLayout>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="mt-4 text-gray-600">Settings page coming soon...</p>
            </div>
          </AppLayout>
        } />
        <Route path="/help" element={
          <AppLayout>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">Help Center</h1>
              <p className="mt-4 text-gray-600">Help resources coming soon...</p>
            </div>
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;