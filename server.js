const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const localAuth = require('./local-auth');

// Environment variables with updated defaults
const JWT_SECRET = process.env.JWT_SECRET || '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

// Add these routes before your other routes
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const authResult = localAuth.authenticate(username, password);
  
  if (!authResult) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    success: true,
    token: authResult.token,
    user: {
      id: authResult.user.id,
      name: authResult.user.name,
      email: authResult.user.email,
      role: authResult.user.role
    }
  });
});

app.get('/auth/user', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware for protected routes
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Static files for main website
app.use(express.static(path.join(__dirname, 'public')));

// Static files for dashboard
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// API Routes - Protected by authentication
app.use('/api', authMiddleware);

// Example protected API route
app.get('/api/data', (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user
  });
});

// Authentication routes
app.post('/auth/token', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  
  try {
    // Verify token logic here
    // For local development, we can create a simple token
    const sessionToken = jwt.sign(
      { 
        email: 'user@example.com',
        name: 'Test User',
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token: sessionToken });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Important: Handle dashboard routes
app.get('/dashboard/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Serve the dashboard SPA
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// SPA fallback for main website routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Main website: http://localhost:${port}`);
  console.log(`Dashboard: http://localhost:${port}/dashboard`);
});