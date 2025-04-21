import axios from 'axios';
import AuthService from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.aretialliance.com';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization header with JWT token if available
    const authHeader = AuthService.getAuthHeader();
    if (authHeader && authHeader.Authorization) {
      config.headers.Authorization = authHeader.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      AuthService.logout();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Mock data generators for development
const generateMockContacts = (count = 10) => {
  const statuses = ['lead', 'opportunity', 'customer', 'partner'];
  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i + 1}`,
    name: `Contact ${i + 1}`,
    email: `contact${i + 1}@example.com`,
    phone: `(555) ${100 + i}-${1000 + i}`,
    company: `Company ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: `Notes about contact ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockOrganizations = (count = 10) => {
  const sizes = ['small', 'medium', 'large'];
  return Array.from({ length: count }, (_, i) => ({
    id: `org-${i + 1}`,
    name: `Organization ${i + 1}`,
    industry: `Industry ${i % 5 + 1}`,
    website: `https://org${i + 1}.example.com`,
    size: sizes[Math.floor(Math.random() * sizes.length)],
    address: `${1000 + i} Main St, City ${i + 1}, State`,
    notes: `Notes about organization ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockTasks = (count = 10) => {
  const statuses = ['pending', 'in-progress', 'completed'];
  const priorities = ['low', 'medium', 'high'];
  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i + 1}`,
    title: `Task ${i + 1}`,
    description: `Description for task ${i + 1}`,
    dueDate: new Date(Date.now() + (Math.random() * 20 - 10) * 86400000).toISOString(),
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    contactId: Math.random() > 0.3 ? `contact-${Math.floor(Math.random() * count) + 1}` : null,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockDrivers = (count = 10) => {
  const statuses = ['active', 'inactive', 'pending'];
  const vehicleTypes = ['car', 'suv', 'cargo', 'truck'];
  return Array.from({ length: count }, (_, i) => ({
    id: `driver-${i + 1}`,
    name: `Driver ${i + 1}`,
    email: `driver${i + 1}@example.com`,
    phone: `(555) ${200 + i}-${2000 + i}`,
    vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
    licenseNumber: `DL${10000 + i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    address: `${2000 + i} Oak St, City ${i + 1}, State`,
    notes: `Notes about driver ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockDeliveries = (count = 10) => {
  const statuses = ['pending', 'in-transit', 'delivered', 'canceled'];
  const priorities = ['standard', 'express', 'rush'];
  return Array.from({ length: count }, (_, i) => ({
    id: `delivery-${i + 1}`,
    trackingNumber: `ARETI-${100000 + i}`,
    description: `Delivery ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    pickupAddress: `${3000 + i} Pickup St, City ${i % 5 + 1}, State`,
    deliveryAddress: `${4000 + i} Delivery St, City ${(i + 3) % 5 + 1}, State`,
    scheduledDate: new Date(Date.now() + (Math.random() * 10 - 5) * 86400000).toISOString(),
    organizationId: Math.random() > 0.3 ? `org-${Math.floor(Math.random() * count) + 1}` : null,
    driverId: Math.random() > 0.3 ? `driver-${Math.floor(Math.random() * count) + 1}` : null,
    notes: `Notes about delivery ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockQuotes = (count = 10) => {
  const statuses = ['pending', 'approved', 'rejected', 'expired'];
  const speeds = ['standard', 'same-day', 'express', 'rush'];
  return Array.from({ length: count }, (_, i) => ({
    id: `quote-${i + 1}`,
    quoteNumber: `QT-${200000 + i}`,
    customerName: `Customer ${i + 1}`,
    customerEmail: `customer${i + 1}@example.com`,
    customerPhone: `(555) ${300 + i}-${3000 + i}`,
    company: Math.random() > 0.3 ? `Company ${i % 5 + 1}` : '',
    status: statuses[Math.floor(Math.random() * statuses.length)],
    totalAmount: Math.floor(5000 + Math.random() * 15000) / 100,
    validUntil: new Date(Date.now() + (Math.random() * 30) * 86400000).toISOString(),
    pickupZip: `${10000 + i % 10}`,
    deliveryZip: `${20000 + i % 10}`,
    packageDetails: `${1 + Math.floor(Math.random() * 3)} packages, ${5 + Math.floor(Math.random() * 45)}lbs total`,
    deliverySpeed: speeds[Math.floor(Math.random() * speeds.length)],
    contactId: Math.random() > 0.3 ? `contact-${Math.floor(Math.random() * count) + 1}` : null,
    notes: `Quote notes ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockRoutes = (count = 10) => {
  const statuses = ['active', 'inactive'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return Array.from({ length: count }, (_, i) => ({
    id: `route-${i + 1}`,
    name: `Route ${i + 1}`,
    startLocation: `${5000 + i} Start St, City ${i % 5 + 1}, State`,
    endLocation: `${6000 + i} End St, City ${(i + 2) % 5 + 1}, State`,
    distance: Math.floor(10 + Math.random() * 100),
    estimatedTime: Math.floor(15 + Math.random() * 120),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    averageDeliveries: Math.floor(5 + Math.random() * 20),
    deliveryDays: Array.from(
      { length: 1 + Math.floor(Math.random() * 5) },
      () => days[Math.floor(Math.random() * days.length)]
    ).filter((day, index, self) => self.indexOf(day) === index), // Remove duplicates
    notes: `Route notes ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
  }));
};

const generateMockRevenueData = (timeframe = 'month') => {
  // Generate monthly revenue data
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
    amount: Math.floor(10000 + Math.random() * 50000)
  }));
  
  // Generate quarterly revenue data
  const quarterlyData = Array.from({ length: 4 }, (_, i) => ({
    name: `Q${i + 1} 2024`,
    amount: Math.floor(50000 + Math.random() * 100000)
  }));
  
  // Generate yearly revenue data
  const yearlyData = Array.from({ length: 5 }, (_, i) => ({
    name: `${2020 + i}`,
    amount: Math.floor(200000 + Math.random() * 500000)
  }));
  
  // Generate revenue by service type
  const byServiceData = [
    { name: 'Standard Delivery', amount: Math.floor(50000 + Math.random() * 100000) },
    { name: 'Same-Day Delivery', amount: Math.floor(40000 + Math.random() * 80000) },
    { name: 'Express Delivery', amount: Math.floor(30000 + Math.random() * 60000) },
    { name: 'Rush Delivery', amount: Math.floor(20000 + Math.random() * 40000) },
    { name: 'Custom Logistics', amount: Math.floor(10000 + Math.random() * 30000) }
  ];
  
  // Generate top customers
  const topCustomers = Array.from({ length: 5 }, (_, i) => ({
    name: `Customer ${i + 1}`,
    company: `Company ${i + 1}`,
    totalRevenue: Math.floor(10000 + Math.random() * 50000),
    orderCount: Math.floor(10 + Math.random() * 90),
    averageOrderValue: Math.floor(500 + Math.random() * 1500)
  }));
  
  // Calculate total revenue for current year and month
  const totalYear = yearlyData[yearlyData.length - 1].amount;
  const totalMonth = monthlyData[new Date().getMonth()].amount;
  
  // Generate comparison percentages
  const comparisonToLastMonth = -10 + Math.random() * 30; // -10% to +20%
  const comparisonToLastYear = -5 + Math.random() * 25; // -5% to +20%
  
  return {
    monthly: monthlyData,
    quarterly: quarterlyData,
    yearly: yearlyData,
    byService: byServiceData,
    topCustomers: topCustomers,
    totalYear,
    totalMonth,
    comparisonToLastMonth,
    comparisonToLastYear,
    averageOrderValue: Math.floor(500 + Math.random() * 500),
    highestRevenueRoute: {
      name: `Route ${Math.floor(Math.random() * 10) + 1}`,
      amount: Math.floor(10000 + Math.random() * 20000)
    }
  };
};

const generateMockPerformanceData = (timeframe = 'week') => {
  // Generate delivery performance data
  let performanceDates = [];
  let numPoints = 0;
  
  if (timeframe === 'week') {
    // Last 7 days
    numPoints = 7;
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      performanceDates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
  } else if (timeframe === 'month') {
    // Last 30 days, weekly data points
    numPoints = 4;
    const today = new Date();
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - (i * 7));
      performanceDates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
  } else {
    // Quarterly, last 3 months
    numPoints = 3;
    const today = new Date();
    for (let i = 2; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      performanceDates.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }
  }
  
  // Generate delivery performance data
  const deliveryPerformance = performanceDates.map(date => ({
    date,
    deliveries: Math.floor(20 + Math.random() * 80),
    onTimePercentage: Math.floor(75 + Math.random() * 20)
  }));
  
  // Generate driver performance data
  const driverPerformance = Array.from({ length: 5 }, (_, i) => ({
    name: `Driver ${i + 1}`,
    onTimePercentage: Math.floor(75 + Math.random() * 25)
  }));
  
  // Generate customer satisfaction data
  const customerSatisfaction = performanceDates.map(date => ({
    date,
    score: 3.5 + Math.random() * 1.5
  }));
  
  // Generate delivery status distribution
  const onTime = Math.floor(70 + Math.random() * 20);
  const delayed = Math.floor(10 + Math.random() * 15);
  const veryDelayed = 100 - onTime - delayed;
  
  // Generate performance insights
  const insightTypes = ['positive', 'warning', 'negative'];
  const insights = Array.from({ length: Math.floor(1 + Math.random() * 3) }, (_, i) => {
    const type = insightTypes[Math.floor(Math.random() * 3)];
    return {
      type,
      title: type === 'positive' 
        ? 'Performance Improvement' 
        : type === 'warning' 
          ? 'Potential Issue Detected' 
          : 'Performance Concern',
      description: type === 'positive'
        ? `On-time delivery rates have improved by ${Math.floor(2 + Math.random() * 8)}% over the last period.`
        : type === 'warning'
          ? `Delivery times for Route ${Math.floor(Math.random() * 10) + 1} are trending 10-15% longer than average.`
          : `Customer satisfaction scores for rush deliveries have decreased by ${Math.floor(2 + Math.random() * 8)}% this period.`
    };
  });
  
  return {
    deliveryPerformance,
    driverPerformance,
    customerSatisfaction,
    deliveryStatus: {
      onTime,
      delayed,
      veryDelayed
    },
    avgDeliveryTime: Math.floor(30 + Math.random() * 40),
    completionRate: (75 + Math.random() * 20) / 100,
    avgSatisfactionScore: 3.8 + Math.random() * 0.9,
    insights
  };
};

// API Service methods
const ApiService = {
  // Contacts
  async getContacts() {
    try {
      const response = await apiClient.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // For development, return mock data
      return generateMockContacts();
    }
  },
  
  async getContact(id) {
    try {
      const response = await apiClient.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      return null;
    }
  },
  
  async createContact(data) {
    try {
      const response = await apiClient.post('/contacts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      return null;
    }
  },
  
  async updateContact(id, data) {
    try {
      const response = await apiClient.put(`/contacts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error);
      return null;
    }
  },
  
  async deleteContact(id) {
    try {
      await apiClient.delete(`/contacts/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      return false;
    }
  },
  
  // Organizations
  async getOrganizations() {
    try {
      const response = await apiClient.get('/organizations');
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // For development, return mock data
      return generateMockOrganizations();
    }
  },
  
  async getOrganization(id) {
    try {
      const response = await apiClient.get(`/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization ${id}:`, error);
      return null;
    }
  },
  
  async createOrganization(data) {
    try {
      const response = await apiClient.post('/organizations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating organization:', error);
      return null;
    }
  },
  
  async updateOrganization(id, data) {
    try {
      const response = await apiClient.put(`/organizations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating organization ${id}:`, error);
      return null;
    }
  },
  
  async deleteOrganization(id) {
    try {
      await apiClient.delete(`/organizations/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting organization ${id}:`, error);
      return false;
    }
  },
  
  // Tasks
  async getTasks() {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // For development, return mock data
      return generateMockTasks();
    }
  },
  
  async getTask(id) {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return null;
    }
  },
  
  async createTask(data) {
    try {
      const response = await apiClient.post('/tasks', data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },
  
  async updateTask(id, data) {
    try {
      const response = await apiClient.put(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return null;
    }
  },
  
  async deleteTask(id) {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      return false;
    }
  },
  
  // Drivers
  async getDrivers() {
    try {
      const response = await apiClient.get('/drivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // For development, return mock data
      return generateMockDrivers();
    }
  },
  
  async getDriver(id) {
    try {
      const response = await apiClient.get(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      return null;
    }
  },
  
  async createDriver(data) {
    try {
      const response = await apiClient.post('/drivers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating driver:', error);
      return null;
    }
  },
  
  async updateDriver(id, data) {
    try {
      const response = await apiClient.put(`/drivers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
      return null;
    }
  },
  
  async deleteDriver(id) {
    try {
      await apiClient.delete(`/drivers/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      return false;
    }
  },
  
  // Deliveries
  async getDeliveries() {
    try {
      const response = await apiClient.get('/deliveries');
      return response.data;
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      // For development, return mock data
      return generateMockDeliveries();
    }
  },
  
  async getDelivery(id) {
    try {
      const response = await apiClient.get(`/deliveries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching delivery ${id}:`, error);
      return null;
    }
  },
  
  async createDelivery(data) {
    try {
      const response = await apiClient.post('/deliveries', data);
      return response.data;
    } catch (error) {
      console.error('Error creating delivery:', error);
      return null;
    }
  },
  
  async updateDelivery(id, data) {
    try {
      const response = await apiClient.put(`/deliveries/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating delivery ${id}:`, error);
      return null;
    }
  },
  
  async deleteDelivery(id) {
    try {
      await apiClient.delete(`/deliveries/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting delivery ${id}:`, error);
      return false;
    }
  },
  
  // Quotes
  async getQuotes() {
    try {
      const response = await apiClient.get('/quotes');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      // For development, return mock data
      return generateMockQuotes();
    }
  },
  
  async getQuote(id) {
    try {
      const response = await apiClient.get(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error);
      return null;
    }
  },
  
  async createQuote(data) {
    try {
      const response = await apiClient.post('/quotes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating quote:', error);
      return null;
    }
  },
  
  async updateQuote(id, data) {
    try {
      const response = await apiClient.put(`/quotes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating quote ${id}:`, error);
      return null;
    }
  },
  
  async deleteQuote(id) {
    try {
      await apiClient.delete(`/quotes/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting quote ${id}:`, error);
      return false;
    }
  },
  
  async createDeliveryFromQuote(quoteId) {
    try {
      const response = await apiClient.post(`/quotes/${quoteId}/convert-to-delivery`);
      return response.data;
    } catch (error) {
      console.error(`Error converting quote ${quoteId} to delivery:`, error);
      return null;
    }
  },
  
  // Routes
  async getRoutes() {
    try {
      const response = await apiClient.get('/routes');
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      // For development, return mock data
      return generateMockRoutes();
    }
  },
  
  async getRoute(id) {
    try {
      const response = await apiClient.get(`/routes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching route ${id}:`, error);
      return null;
    }
  },
  
  async createRoute(data) {
    try {
      const response = await apiClient.post('/routes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      return null;
    }
  },
  
  async updateRoute(id, data) {
    try {
      const response = await apiClient.put(`/routes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating route ${id}:`, error);
      return null;
    }
  },
  
  async deleteRoute(id) {
    try {
      await apiClient.delete(`/routes/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting route ${id}:`, error);
      return false;
    }
  },
  
  // Revenue Data
  async getRevenueData(dateRange = 'month') {
    try {
      const response = await apiClient.get(`/analytics/revenue?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching revenue data:`, error);
      // For development, return mock data
      return generateMockRevenueData(dateRange);
    }
  },
  
  // Performance Data
  async getPerformanceData(timeFrame = 'week') {
    try {
      const response = await apiClient.get(`/analytics/performance?timeFrame=${timeFrame}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching performance data:`, error);
      // For development, return mock data
      return generateMockPerformanceData(timeFrame);
    }
  },
  
  // Dashboard Data
  async getDashboardData() {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // For development, create mock dashboard data
      return {
        stats: {
          totalContacts: 100 + Math.floor(Math.random() * 50),
          totalOrganizations: 50 + Math.floor(Math.random() * 30),
          activeDrivers: 20 + Math.floor(Math.random() * 15),
          pendingDeliveries: 30 + Math.floor(Math.random() * 20),
          totalRevenue: 50000 + Math.floor(Math.random() * 50000),
          onTimeDeliveryRate: 85 + Math.floor(Math.random() * 10)
        },
        recentActivity: Array.from({ length: 5 }, (_, i) => ({
          id: `activity-${i + 1}`,
          type: ['delivery', 'quote', 'contact', 'driver'][Math.floor(Math.random() * 4)],
          description: `Recent activity ${i + 1}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString()
        }))
      };
    }
  }
};

export default ApiService;