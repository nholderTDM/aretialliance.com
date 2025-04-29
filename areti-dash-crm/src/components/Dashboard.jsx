import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Users, 
  Building,
  CheckSquare,
  Truck,
  MapPin,
  DollarSign,
  FileText,
  Activity,
  Settings, 
  LogOut, 
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import AuthService from '../services/auth';
import Overview from './Overview';
import Contacts from './Contacts';
import Organizations from './Organizations';
import Tasks from './Tasks';
import Drivers from './Drivers';
import Deliveries from './Deliveries';
import Quotes from './Quotes';
import Revenue from './Revenue';
import Routes from './Routes';
import Performance from './Performance';
import ScriptNavigator from './ScriptNavigator';

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
    
    // Check authentication
    if (!AuthService.isAuthenticated()) {
      // Redirect to login if not authenticated
      AuthService.login();
      return;
    }
    
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
      
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
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
    // Save preference to localStorage
    localStorage.setItem('darkMode', !darkMode);
  };
  
  // Content rendering based on tab
  const renderContent = () => {
    switch(currentTab) {
      case 'overview':
        return <Overview />;
      case 'scripts':
        return <ScriptNavigator />;
      case 'contacts':
        return <Contacts />;
      case 'organizations':
        return <Organizations />;
      case 'tasks':
        return <Tasks />;
      case 'drivers':
        return <Drivers />;
      case 'deliveries':
        return <Deliveries />;
      case 'quotes':
        return <Quotes />;
      case 'revenue':
        return <Revenue />;
      case 'routes':
        return <Routes />;
      case 'performance':
        return <Performance />;
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
        
        <nav className="mt-5 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
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

        <a href="#" 
          onClick={() => setCurrentTab('scripts')}
  className={`flex items-center py-3 px-4 ${currentTab === 'scripts' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
>
  <FileText size={20} />
  {sidebarOpen && <span className="ml-3">Script Navigator</span>}
</a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('contacts')}
            className={`flex items-center py-3 px-4 ${currentTab === 'contacts' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Contacts</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('organizations')}
            className={`flex items-center py-3 px-4 ${currentTab === 'organizations' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Building size={20} />
            {sidebarOpen && <span className="ml-3">Organizations</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('tasks')}
            className={`flex items-center py-3 px-4 ${currentTab === 'tasks' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <CheckSquare size={20} />
            {sidebarOpen && <span className="ml-3">Tasks</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('drivers')}
            className={`flex items-center py-3 px-4 ${currentTab === 'drivers' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Drivers</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('deliveries')}
            className={`flex items-center py-3 px-4 ${currentTab === 'deliveries' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Truck size={20} />
            {sidebarOpen && <span className="ml-3">Deliveries</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('quotes')}
            className={`flex items-center py-3 px-4 ${currentTab === 'quotes' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <FileText size={20} />
            {sidebarOpen && <span className="ml-3">Quotes</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('revenue')}
            className={`flex items-center py-3 px-4 ${currentTab === 'revenue' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <DollarSign size={20} />
            {sidebarOpen && <span className="ml-3">Revenue</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('routes')}
            className={`flex items-center py-3 px-4 ${currentTab === 'routes' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <MapPin size={20} />
            {sidebarOpen && <span className="ml-3">Routes</span>}
          </a>
          
          <a 
            href="#" 
            onClick={() => setCurrentTab('performance')}
            className={`flex items-center py-3 px-4 ${currentTab === 'performance' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Activity size={20} />
            {sidebarOpen && <span className="ml-3">Performance</span>}
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
            
            <nav className="mt-5 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
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
  onClick={() => { setCurrentTab('scripts'); toggleMobileMenu(); }}
  className={`flex items-center py-3 px-4 ${currentTab === 'scripts' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
>
  <FileText size={20} />
  <span className="ml-3">Script Navigator</span>
</a>

              <a 
                href="#" 
                onClick={() => { setCurrentTab('contacts'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'contacts' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Users size={20} />
                <span className="ml-3">Contacts</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('organizations'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'organizations' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Building size={20} />
                <span className="ml-3">Organizations</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('tasks'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'tasks' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <CheckSquare size={20} />
                <span className="ml-3">Tasks</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('drivers'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'drivers' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Users size={20} />
                <span className="ml-3">Drivers</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('deliveries'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'deliveries' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Truck size={20} />
                <span className="ml-3">Deliveries</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('quotes'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'quotes' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <FileText size={20} />
                <span className="ml-3">Quotes</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('revenue'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'revenue' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <DollarSign size={20} />
                <span className="ml-3">Revenue</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('routes'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'routes' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <MapPin size={20} />
                <span className="ml-3">Routes</span>
              </a>
              
              <a 
                href="#" 
                onClick={() => { setCurrentTab('performance'); toggleMobileMenu(); }}
                className={`flex items-center py-3 px-4 ${currentTab === 'performance' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Activity size={20} />
                <span className="ml-3">Performance</span>
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
        <main className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;