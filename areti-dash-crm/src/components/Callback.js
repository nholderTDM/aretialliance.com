// components/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Callback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Process authentication when component mounts
    AuthService.handleAuthentication();
    
    // Redirect to the main dashboard
    navigate('/', { replace: true });
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Callback;