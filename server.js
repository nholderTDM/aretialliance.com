const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// JWT Secret
const JWT_SECRET = '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

// User database
const users = [
  {
    id: '1',
    username: 'areti-admin',
    password: 'admin123', // In production, use hashed passwords!
    name: 'Areti Admin',
    email: 'natholder1@gmail.com',
    role: 'admin'
  },
  {
    id: '2',
    username: 'nholder',
    password: 'Belle2025!!',
    name: 'Nate Holder',
    email: 'nholder@aretialliance.com',
    role: 'admin'
  },
  {
    id: '3',
    username: 'fgill',
    password: 'user123',
    name: 'Fonda Gill',
    email: 'fgill@aretialliance.com',
    role: 'user'
  }
];

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const DRIVERS_FILE = path.join(DATA_DIR, 'drivers.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(DRIVERS_FILE)) {
  fs.writeFileSync(DRIVERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([]));
}

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Authentication function
function authenticate(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  
  const token = jwt.sign(
    { 
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return { user, token };
}

// Authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Helper functions for data operations
function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
}

function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    return false;
  }
}

// Login route - this is the critical endpoint for authentication
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const result = authenticate(username, password);
  
  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    success: true,
    token: result.token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role
    }
  });
});

// Protected route for token verification
app.get('/api/data', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// API Routes for Drivers
// Get all drivers
app.get('/api/drivers', authMiddleware, (req, res) => {
  const drivers = readData(DRIVERS_FILE);
  res.json(drivers);
});

// Get a single driver
app.get('/api/drivers/:id', authMiddleware, (req, res) => {
  const drivers = readData(DRIVERS_FILE);
  const driver = drivers.find(d => d.id === req.params.id);
  
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  res.json(driver);
});

// Create a new driver
app.post('/api/drivers', authMiddleware, (req, res) => {
  const drivers = readData(DRIVERS_FILE);
  const newDriver = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  drivers.push(newDriver);
  
  if (writeData(DRIVERS_FILE, drivers)) {
    res.status(201).json(newDriver);
  } else {
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

// Update a driver
app.put('/api/drivers/:id', authMiddleware, (req, res) => {
  const drivers = readData(DRIVERS_FILE);
  const index = drivers.findIndex(d => d.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  const updatedDriver = {
    ...drivers[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  drivers[index] = updatedDriver;
  
  if (writeData(DRIVERS_FILE, drivers)) {
    res.json(updatedDriver);
  } else {
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

// Delete a driver
app.delete('/api/drivers/:id', authMiddleware, (req, res) => {
  const drivers = readData(DRIVERS_FILE);
  const filteredDrivers = drivers.filter(d => d.id !== req.params.id);
  
  if (drivers.length === filteredDrivers.length) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  
  if (writeData(DRIVERS_FILE, filteredDrivers)) {
    res.json({ message: 'Driver deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
});

// Public endpoint to receive driver applications from the public website
app.post('/api/public/driver-applications', (req, res) => {
  try {
    const drivers = readData(DRIVERS_FILE);
    
    // Format phone number if needed
    let phone = req.body.phone || '';
    // Remove non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Format if 10 digits
    if (digits.length === 10) {
      phone = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    // Create the new driver application
    const newDriver = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      phone: phone,
      city: req.body.city,
      state: req.body.state,
      vehicleType: Array.isArray(req.body.vehicleTypes) && req.body.vehicleTypes.length > 0 
        ? req.body.vehicleTypes[0] 
        : 'car',
      status: 'pending',
      notes: req.body.notes || '',
      applicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Additional fields from the application form
      contactPreference: req.body.contactPreference,
      backgroundCheckConsent: req.body.backgroundCheck,
      drivingHistoryConfirmed: req.body.drivingHistory,
      smsConsent: req.body.smsConsent,
      vehicleTypes: req.body.vehicleTypes || []
    };
    
    drivers.push(newDriver);
    
    if (writeData(DRIVERS_FILE, drivers)) {
      // Success - return 201 Created status
      res.status(201).json({ success: true, message: 'Application received successfully' });
    } else {
      // Failed to write to file
      res.status(500).json({ success: false, error: 'Failed to process application' });
    }
  } catch (error) {
    console.error('Error processing driver application:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// API Routes for Other Entities (Contacts, Organizations, etc.)
// Add similar CRUD endpoints for other entities you need

// Get all contacts
app.get('/api/contacts', authMiddleware, (req, res) => {
  const contacts = readData(CONTACTS_FILE);
  res.json(contacts);
});

// Add more endpoints for CRUD operations on contacts

// Serve static files
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Main website fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Add these imports at the top of the file
const cron = require('node-cron');
const { syncDriversFromSheet } = require('./sync-drivers');
require('dotenv').config();

// Add this code before app.listen()

// API endpoint for on-demand sync
app.post('/api/sync/drivers', authMiddleware, async (req, res) => {
  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }
  
  try {
    const result = await syncDriversFromSheet();
    res.json(result);
  } catch (error) {
    console.error('Error in sync endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error syncing from Google Sheets: ' + error.message 
    });
  }
});

// Set up scheduled sync
const syncSchedule = process.env.SYNC_SCHEDULE || '0 0 * * *'; // Default: daily at midnight
try {
  cron.schedule(syncSchedule, async () => {
    console.log(`Running scheduled drivers sync at ${new Date().toISOString()}`);
    try {
      const result = await syncDriversFromSheet();
      console.log('Scheduled sync completed:', result);
    } catch (error) {
      console.error('Error in scheduled sync:', error);
    }
  });
  console.log(`Scheduled sync configured with schedule: ${syncSchedule}`);
} catch (error) {
  console.error('Failed to set up scheduled sync:', error);
}
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Website: http://localhost:${port}`);
  console.log(`Dashboard: http://localhost:${port}/dashboard`);
});