import React, { useState, useEffect } from 'react';
import AuthService from './services/keycloak';
// Add this import at the top with your other imports:
import AuthService from '../services/keycloak';
import Login from '../components/Login';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Layers, 
  Users, 
  FileText, 
  Truck, 
  MapPin, 
  AlertCircle,
  Settings, 
  Bell, 
  Search, 
  LogOut, 
  Calendar,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  BarChart2,
  CheckSquare,
  User,
  Moon,
  Sun,
  Mail,
  Lock,
  ShieldCheck,
  Key
} from 'lucide-react';

// Authentication component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication - in a real app, this would call an API
    setTimeout(() => {
      // Allowed users - in production this would be verified server-side
      const validUsers = [
        { email: 'admin@aretialliance.com', password: 'admin123', role: 'admin' },
        { email: 'manager@aretialliance.com', password: 'manager123', role: 'manager' },
        { email: 'user@aretialliance.com', password: 'user123', role: 'user' }
      ];

      const user = validUsers.find(user => user.email === email && user.password === password);
      
      if (user) {
        // Store authentication in localStorage for persistence
        localStorage.setItem('aretiUser', JSON.stringify({
          email: user.email,
          role: user.role,
          name: user.email.split('@')[0],
          token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
          timestamp: new Date().getTime()
        }));
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Add this right before the main return statement:
if (!isAuthenticated) {
  return <Login onLogin={() => setIsAuthenticated(true)} />;
}

// Then your existing return statement will follow:
return (
  <div className={`flex h-screen bg-gray-100 ${darkMode ? 'dark' : ''}`}>
  // ... rest of your component

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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="flex items-center border border-gray-300 rounded-t-md">
                <div className="p-2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="flex items-center border border-gray-300 rounded-b-md">
                <div className="p-2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo credentials
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-y-2 text-sm text-gray-600">
              <div>
                <strong>Admin:</strong> admin@aretialliance.com / admin123
              </div>
              <div>
                <strong>Manager:</strong> manager@aretialliance.com / manager123
              </div>
              <div>
                <strong>User:</strong> user@aretialliance.com / user123
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Add these two new state variables:
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [currentUser, setCurrentUser] = useState(null);

// Add this new useEffect hook:
useEffect(() => {
  AuthService.init()
    .then(authenticated => {
      if (authenticated) {
        // User is authenticated
        const userProfile = AuthService.getUserProfile();
        setCurrentUser(userProfile);
        setIsAuthenticated(true);
      }
    })
    .catch(error => {
      console.error('Keycloak init error:', error);
    });
}, []);

  // Check for existing session on component mount
  useEffect(() => {
    const user = localStorage.getItem('aretiUser');
    if (user) {
      const userData = JSON.parse(user);
      // Check if token is expired (24 hour validity)
      const now = new Date().getTime();
      const isExpired = now - userData.timestamp > 24 * 60 * 60 * 1000;
      
      if (!isExpired) {
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('aretiUser');
      }
    }
  }, []);

  // Handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  // Replace the existing handleLogout function with this:
const handleLogout = () => {
  AuthService.logout();
};
  
  // Mock data for charts and metrics
  const performanceData = [
    { name: 'Jan', deliveries: 400, quotes: 240, leads: 180 },
    { name: 'Feb', deliveries: 300, quotes: 220, leads: 170 },
    { name: 'Mar', deliveries: 500, quotes: 290, leads: 220 },
    { name: 'Apr', deliveries: 280, quotes: 200, leads: 140 },
    { name: 'May', deliveries: 590, quotes: 320, leads: 250 },
    { name: 'Jun', deliveries: 390, quotes: 280, leads: 210 },
    { name: 'Jul', deliveries: 490, quotes: 310, leads: 230 }
  ];
  
  const revenueData = [
    { name: 'Jan', revenue: 38000 },
    { name: 'Feb', revenue: 42000 },
    { name: 'Mar', revenue: 55000 },
    { name: 'Apr', revenue: 35000 },
    { name: 'May', revenue: 60000 },
    { name: 'Jun', revenue: 48000 },
    { name: 'Jul', revenue: 52000 }
  ];
  
  const deliveryStatusData = [
    { name: 'Completed', value: 85 },
    { name: 'In Transit', value: 10 },
    { name: 'Delayed', value: 3 },
    { name: 'Failed', value: 2 }
  ];
  
  const COLORS = ['#0C3B66', '#1E88E5', '#FF9800', '#FF5722'];
  
  const activeLeads = [
    { id: 1, name: 'AtlantaFresh', contact: 'James Reynolds', status: 'Hot', value: '$12,500', lastContact: '2025-04-12' },
    { id: 2, name: 'Peachtree Boutique', contact: 'Sarah Johnson', status: 'Warm', value: '$8,200', lastContact: '2025-04-10' },
    { id: 3, name: 'TechSupply Inc.', contact: 'David Martinez', status: 'Warm', value: '$15,400', lastContact: '2025-04-08' },
    { id: 4, name: 'Georgia Grocers', contact: 'Emily Wilson', status: 'Cold', value: '$6,300', lastContact: '2025-04-05' },
    { id: 5, name: 'Piedmont Healthcare', contact: 'Michael Brown', status: 'Hot', value: '$21,000', lastContact: '2025-04-11' }
  ];
  
  const recentQuotes = [
    { id: 101, client: 'Modells Apparel', date: '2025-04-13', amount: '$3,250.00', status: 'Pending' },
    { id: 102, client: 'Westside Market', date: '2025-04-12', amount: '$1,875.50', status: 'Accepted' },
    { id: 103, client: 'North Atlanta Dental', date: '2025-04-10', amount: '$725.00', status: 'Pending' },
    { id: 104, client: 'Marietta Bakery', date: '2025-04-09', amount: '$4,300.00', status: 'Declined' },
    { id: 105, client: 'Cumming Electronics', date: '2025-04-08', amount: '$2,150.00', status: 'Accepted' }
  ];
  
  const upcomingTasks = [
    { id: 1, task: 'Follow up with Peachtree Boutique', due: '2025-04-16', priority: 'High', type: 'Follow-up' },
    { id: 2, task: 'Send revised quote to North Atlanta Dental', due: '2025-04-15', priority: 'Medium', type: 'Follow-up' },
    { id: 3, task: 'Schedule demo with Piedmont Healthcare', due: '2025-04-17', priority: 'High', type: 'Call' },
    { id: 4, task: 'Review driver applications', due: '2025-04-18', priority: 'Medium', type: 'Review' },
    { id: 5, task: 'Update service pricing', due: '2025-04-20', priority: 'Low', type: 'Admin' }
  ];
  
  const activeDrivers = [
    { id: 1, name: 'Marcus Thompson', status: 'Active', deliveries: 28, rating: 4.9, vehicle: 'Cargo Van' },
    { id: 2, name: 'Layla Washington', status: 'Active', deliveries: 22, rating: 4.7, vehicle: 'Car' },
    { id: 3, name: 'Robert Patterson', status: 'Inactive', deliveries: 0, rating: 4.8, vehicle: 'Truck' },
    { id: 4, name: 'Jessica Alvarez', status: 'Active', deliveries: 31, rating: 4.9, vehicle: 'Sprinter' },
    { id: 5, name: 'Tyler Johnson', status: 'Active', deliveries: 15, rating: 4.6, vehicle: 'SUV' }
  ];
  
  const activeRoutes = [
    { id: 'RT-1098', driver: 'Marcus Thompson', stops: 12, status: 'In Progress', eta: '10:45 AM' },
    { id: 'RT-1099', driver: 'Layla Washington', stops: 8, status: 'In Progress', eta: '11:30 AM' },
    { id: 'RT-1100', driver: 'Jessica Alvarez', stops: 15, status: 'Starting', eta: '12:15 PM' },
    { id: 'RT-1101', driver: 'Tyler Johnson', stops: 9, status: 'Starting', eta: '1:00 PM' },
    { id: 'RT-1102', driver: 'Mia Robinson', stops: 11, status: 'Scheduled', eta: '2:30 PM' }
  ];
  
  const todayDeliveries = {
    total: 55,
    completed: 22,
    inProgress: 20,
    scheduled: 13,
    delayed: 0
  };
  
  const notifications = [
    { id: 1, message: 'Route RT-1098 is experiencing delays due to traffic', time: '9:32 AM', read: false },
    { id: 2, message: 'New quote request from Buckhead Medical Center', time: '9:15 AM', read: false },
    { id: 3, message: 'Driver Layla Washington completed all deliveries', time: '8:45 AM', read: true },
    { id: 4, message: 'Task reminder: Follow up with Peachtree Boutique', time: '8:30 AM', read: true },
    { id: 5, message: '5 new driver applications received', time: 'Yesterday', read: true }
  ];
  
  const statusColors = {
    'Hot': 'bg-red-500',
    'Warm': 'bg-amber-500',
    'Cold': 'bg-blue-500',
    'Pending': 'bg-yellow-500',
    'Accepted': 'bg-green-500',
    'Declined': 'bg-red-500',
    'High': 'bg-red-500',
    'Medium': 'bg-amber-500',
    'Low': 'bg-blue-500',
    'Active': 'bg-green-500',
    'Inactive': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    'Starting': 'bg-amber-500',
    'Scheduled': 'bg-purple-500',
    'Delivered': 'bg-green-500',
    'In Transit': 'bg-blue-500',
    'Delayed': 'bg-yellow-500',
    'Failed': 'bg-red-500'
  };
  
  // Functions
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render summary cards for dashboard overview
  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Today's Deliveries</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{todayDeliveries.total}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <Truck size={20} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-2 flex text-xs">
          <span className="text-green-500 mr-2">
            {todayDeliveries.completed} Completed
          </span>
          <span className="text-blue-500 mr-2">
            {todayDeliveries.inProgress} In Progress
          </span>
          <span className="text-purple-500">
            {todayDeliveries.scheduled} Scheduled
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Drivers</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{activeDrivers.filter(d => d.status === 'Active').length}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-full">
            <Users size={20} className="text-green-600" />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Out of {activeDrivers.length} total drivers
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Active Routes</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{activeRoutes.length}</p>
          </div>
          <div className="p-2 bg-amber-100 rounded-full">
            <MapPin size={20} className="text-amber-600" />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {activeRoutes.filter(r => r.status === 'In Progress').length} currently in progress
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{upcomingTasks.length}</p>
          </div>
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle size={20} className="text-red-600" />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {upcomingTasks.filter(t => t.priority === 'High').length} high priority
        </div>
      </div>
    </div>
  );

  // Define style variables
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-20';
  const mainWidth = sidebarOpen ? 'md:ml-64' : 'md:ml-20';

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

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
            onClick={() => setCurrentTab('leads')}
            className={`flex items-center py-3 px-4 ${currentTab === 'leads' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Leads & Customers</span>}
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
            onClick={() => setCurrentTab('deliveries')}
            className={`flex items-center py-3 px-4 ${currentTab === 'deliveries' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Truck size={20} />
            {sidebarOpen && <span className="ml-3">Deliveries</span>}
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
            onClick={() => setCurrentTab('drivers')}
            className={`flex items-center py-3 px-4 ${currentTab === 'drivers' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <User size={20} />
            {sidebarOpen && <span className="ml-3">Drivers</span>}
          </a>
          <a 
            href="#" 
            onClick={() => setCurrentTab('tasks')}
            className={`flex items-center py-3 px-4 ${currentTab === 'tasks' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Calendar size={20} />
            {sidebarOpen && <span className="ml-3">Tasks & Follow-ups</span>}
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

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`} onClick={toggleMobileMenu}></div>
      <div className={`fixed inset-y-0 left-0 w-64 bg-blue-800 text-white z-50 md:hidden transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
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
          {/* Mobile Navigation Items */}
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
            onClick={() => { setCurrentTab('leads'); toggleMobileMenu(); }}
            className={`flex items-center py-3 px-4 ${currentTab === 'leads' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Users size={20} />
            <span className="ml-3">Leads & Customers</span>
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
            onClick={() => { setCurrentTab('deliveries'); toggleMobileMenu(); }}
            className={`flex items-center py-3 px-4 ${currentTab === 'deliveries' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Truck size={20} />
            <span className="ml-3">Deliveries</span>
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
            onClick={() => { setCurrentTab('drivers'); toggleMobileMenu(); }}
            className={`flex items-center py-3 px-4 ${currentTab === 'drivers' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <User size={20} />
            <span className="ml-3">Drivers</span>
          </a>
          <a 
            href="#" 
            onClick={() => { setCurrentTab('tasks'); toggleMobileMenu(); }}
            className={`flex items-center py-3 px-4 ${currentTab === 'tasks' ? 'bg-blue-900' : 'hover:bg-blue-700'} transition-colors`}
          >
            <Calendar size={20} />
            <span className="ml-3">Tasks & Follow-ups</span>
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
      </div>

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
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="border border-gray-300 rounded-full py-1 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button onClick={toggleDarkMode} className="p-1 rounded-full hover:bg-gray-100">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1 rounded-full hover:bg-gray-100"
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 font-medium">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{notification.message}</p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-200 text-center">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="font-medium">{currentUser?.name?.[0]?.toUpperCase() || 'A'}</span>
                  </div>
                  <span className="ml-2 text-sm hidden md:block">{currentUser?.name || 'User'}</span>
                </div>

                {/* User dropdown menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        <p className="font-medium">{currentUser?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email}</p>
                        <p className="text-xs text-gray-500 capitalize mt-1">Role: {currentUser?.role || 'User'}</p>
                      </div>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <Key size={16} className="mr-2" />
                        Change Password
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <ShieldCheck size={16} className="mr-2" />
                        Security Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {/* Display different content based on current tab */}
          {currentTab === 'overview' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Dashboard Overview</h2>
                <button 
                  className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Settings size={16} />
                  Customize
                </button>
              </div>

              {/* Summary Cards */}
              {renderSummaryCards()}

              {/* Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Metrics</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="deliveries" stroke="#0C3B66" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="quotes" stroke="#1E88E5" />
                        <Line type="monotone" dataKey="leads" stroke="#FF9800" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Delivery Status */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Delivery Status</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deliveryStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {deliveryStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Monthly Revenue */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Revenue</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#0C3B66" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Active Leads */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Active Leads</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">{lead.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{lead.contact}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[lead.status] || 'bg-gray-500'}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">{lead.value}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{formatDate(lead.lastContact)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentTab === 'leads' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Leads & Customers</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  Add Lead
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Lead Management</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{lead.name}</td>
                          <td className="px-4 py-2">{lead.contact}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[lead.status] || 'bg-gray-500'}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{lead.value}</td>
                          <td className="px-4 py-2">{formatDate(lead.lastContact)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'quotes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Quotes</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  New Quote
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Quote Management</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentQuotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">#{quote.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{quote.client}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatDate(quote.date)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{quote.amount}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[quote.status] || 'bg-gray-500'}`}>
                              {quote.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'deliveries' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Deliveries</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  New Delivery
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Status Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Delivery Status</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deliveryStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {deliveryStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Active Routes */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Active Routes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeRoutes.map((route) => (
                          <tr key={route.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">{route.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{route.driver}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{route.stops}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[route.status] || 'bg-gray-500'}`}>
                                {route.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">{route.eta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'routes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Routes</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  Create Route
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Active Routes</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeRoutes.map((route) => (
                        <tr key={route.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">{route.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{route.driver}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{route.stops}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[route.status] || 'bg-gray-500'}`}>
                              {route.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{route.eta}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'drivers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Drivers</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  Add Driver
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Driver Management</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeDrivers.map((driver) => (
                        <tr key={driver.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">{driver.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[driver.status] || 'bg-gray-500'}`}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{driver.deliveries}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{driver.rating} ★</td>
                          <td className="px-4 py-2 whitespace-nowrap">{driver.vehicle}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'tasks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Tasks & Follow-ups</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1">
                  <Plus size={16} />
                  New Task
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">{task.task}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatDate(task.due)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold text-white ${statusColors[task.priority] || 'bg-gray-500'}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{task.type}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <CheckSquare size={16} />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit size={16} />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                <button className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Dashboard Preferences</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">General Settings</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <button 
                          onClick={toggleDarkMode}
                          className={`w-12 h-6 flex items-center ${darkMode ? 'bg-blue-600' : 'bg-gray-200'} rounded-full p-1 transition-colors`}
                        >
                          <span className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : ''}`}></span>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Real-time Updates</span>
                        <button 
                          className={`w-12 h-6 flex items-center bg-blue-600 rounded-full p-1`}
                        >
                          <span className={`bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6`}></span>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <button 
                          className={`w-12 h-6 flex items-center bg-blue-600 rounded-full p-1`}
                        >
                          <span className={`bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6`}></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Account Settings</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" defaultValue="Admin User" />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Email Address</label>
                        <input type="email" className="w-full border border-gray-300 rounded px-3 py-2" defaultValue="admin@aretialliance.com" />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input type="password" className="w-full border border-gray-300 rounded px-3 py-2" defaultValue="********" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// CSS styles for dark mode
const DarkModeStyles = () => {
  return (
    <style>{`
      .dark {
        background-color: #1a202c;
        color: #e2e8f0;
      }
      
      .dark .bg-white {
        background-color: #2d3748;
        color: #e2e8f0;
      }
      
      .dark .bg-gray-50 {
        background-color: #4a5568;
        color: #e2e8f0;
      }
      
      .dark .text-gray-800 {
        color: #e2e8f0;
      }
      
      .dark .text-gray-500 {
        color: #a0aec0;
      }
      
      .dark .hover\\:bg-gray-50:hover {
        background-color: #4a5568;
      }
      
      .dark .border-gray-200 {
        border-color: #4a5568;
      }
    `}</style>
  );
};

// Role-based access control wrapper component
const RoleBasedRouteGuard = ({ requiredRole, children }) => {
  const user = JSON.parse(localStorage.getItem('aretiUser') || '{}');
  const userRole = user.role || 'guest';
  
  // Role hierarchy
  const roleHierarchy = {
    admin: 3,
    manager: 2,
    user: 1,
    guest: 0
  };
  
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
  const userRoleLevel = roleHierarchy[userRole] || 0;
  
  // Check if user has sufficient permissions
  if (userRoleLevel >= requiredRoleLevel) {
    return children;
  }
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
      <p className="font-bold">Access Denied</p>
      <p>You don't have permission to access this section.</p>
    </div>
  );
};

const App = () => {
  return (
    <>
      <DarkModeStyles />
      <Dashboard />
    </>
  );
};

export default App;