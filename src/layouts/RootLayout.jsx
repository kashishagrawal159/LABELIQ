import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../context/AuthContext';

export default function RootLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Pages that don't need sidebar
  const isPublicStandalone = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/role-selection' ||
    location.pathname === '/consumer/login' ||
    location.pathname === '/inspector/login' ||
    location.pathname === '/manufacturer/login';

  const showSidebar = user && !isPublicStandalone;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && <Sidebar />}

        <main className={`flex-1 overflow-y-auto ${showSidebar ? 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full' : 'w-full'}`}>
          <Outlet />
        </main>
      </div>

      {/* Persistent AI Chatbot across all pages */}
      <Chatbot />
    </div>
  );
}
