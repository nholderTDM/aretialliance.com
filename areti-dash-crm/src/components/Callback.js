import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      await AuthService.init();
      navigate('/');
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Logging you in...</h2>
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Callback;