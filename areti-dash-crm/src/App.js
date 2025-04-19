import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
//import Dashboard from './pages/Dashboard';
import Dashboard from './components/Dashboard';
import Callback from './components/Callback';
import AuthService from './services/auth';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await AuthService.init();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/callback" element={<Callback />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;