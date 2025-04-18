import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import AuthService from '../services/keycloak';

const Dashboard = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  
  // Check for existing session on component mount
  useEffect(() => {
    console.log('Dashboard mounting, checking auth...');
    setAuthLoading(true);
    
    // Initialize authentication
    AuthService.init()
      .then(authenticated => {
        console.log('Auth initialization result:', authenticated);
        if (authenticated) {
          const userData = AuthService.getUserProfile();
          console.log('User profile:', userData);
          if (userData) {
            setCurrentUser(userData);
            setIsAuthenticated(true);
          } else {
            console.log('No user profile found, redirecting to login');
            AuthService.login();
          }
        } else {
          console.log('Not authenticated, redirecting to login');
          AuthService.login();
        }
      })
      .catch(error => {
        console.error('Authentication error:', error);
        AuthService.login();
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  // Handle login
  const handleLogin = () => {
    AuthService.login();
  };

  // Handle logout
  const handleLogout = () => {
    // Reset component state
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Log out via AuthService
    AuthService.logout();
  };
  
  // UI functions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Could also save this preference to localStorage
    localStorage.setItem('darkMode', !darkMode);
  };
  
  // Content rendering based on tab
  const renderContent = () => {
    switch(currentTab) {
      case 'overview':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Welcome, {currentUser?.name || 'User'}!</h2>
            <p>You are logged in as: <strong>{currentUser?.role || 'User'}</strong></p>
            <p className="mt-4">This is the overview dashboard.</p>
          </div>
        );
      case 'users':
        // Only admins can access user management
        if (currentUser?.role !== 'admin') {
          return (
            <div className="bg-red-100 p-6 rounded-lg border border-red-300">
              <h2 className="text-lg font-semibold mb-4 text-red-700">Access Denied</h2>
              <p>You need admin privileges to access this section.</p>
            </div>
          );
        }
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">User Management</h2>
            <p>This page would show user management features.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <p>This page would show settings options.</p>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Page Not Found</h2>
            <p>The requested page was not found.</p>
          </div>
        );
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Areti Alliance CRM
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          
          <div>
            <button
              onClick={handleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with SSO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Define style variables
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-20';
  const mainWidth = sidebarOpen ? 'ml-64' : 'ml-20';

  return (
    <div className={`flex h-screen bg-gray-100 ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 ${sidebarWidth} bg-blue-800 text-white transition-all duration-300 ease-in-out z-30 shadow-lg hidden md:block`}>
        <div className="flex items-center justify-between p-4 border-b border-blue-900">
          <div className="flex items-center">
            {sidebarOpen ? (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-800 font-bold">A</span>
                </div>
                <span className="font-bold text-lg">Areti Alliance</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-bold">A</span>
              </div>
            )}
          </div>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-5">
          <div className={`px-4 pb-4 ${sidebarOpen ? 'text-sm text-gray-300' : 'text-center'}`}>
            {sidebarOpen ? 'MAIN MENU' : ''}
          </div>
          <a 
            href="#" 
            onClick={() => setCurrentTab('overview')}
            className={`flex items-center py-3 px-4 ${currentTab === 'overview' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Layers size={20} />
            {sidebarOpen && <span className="ml-3">Overview</span>}
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentTab('users')}
            className={`flex items-center py-3 px-4 ${currentTab === 'users' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Users</span>}
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center py-3 px-4 ${currentTab === 'settings' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </a>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-blue-900">
          <button onClick={handleLogout} className="flex items-center text-white w-full">
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white z-50" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-blue-900">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-800 font-bold">A</span>
                </div>
                <span className="font-bold text-lg">Areti Alliance</span>
              </div>
              <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                <X size={20} />
              </button>
            </div>
            <nav className="mt-5">
              <div className="px-4 pb-4 text-sm text-gray-300">MAIN MENU</div>
              <a 
                href="#" 
                onClick={() => { setCurrentTab('overview'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'overview' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Layers size={20} />
                <span className="ml-3">Overview</span>
              </a>
              <a 
                href="#" 
                onClick={() => { setCurrentTab('users'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'users' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Users size={20} />
                <span className="ml-3">Users</span>
              </a>
              <a 
                href="#" 
                onClick={() => { setCurrentTab('settings'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'settings' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Settings size={20} />
                <span className="ml-3">Settings</span>
              </a>
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-blue-900">
              <button onClick={handleLogout} className="flex items-center text-white w-full">
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainWidth}`}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center">
              <button className="md:hidden mr-4" onClick={toggleMobileMenu}>
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-1 rounded-full hover:bg-gray-100">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <span className="font-medium">{currentUser?.name?.[0]?.toUpperCase() || 'A'}</span>
                </div>
                <span className="ml-2 text-sm hidden md:block">{currentUser?.name || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;