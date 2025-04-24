const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Environment variables with defaults
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://auth.aretialliance.com';
const KEYCLOAK_REALM = process.env.REALM || 'areti-alliance';
const JWT_SECRET = process.env.JWT_SECRET || '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://aretialliance.com'],
  credentials: true
}));
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
    // Verify Keycloak token by calling userinfo endpoint
    const keycloakResponse = await axios.get(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    const userInfo = keycloakResponse.data;
    
    // Extract roles from token
    const roles = userInfo.realm_access?.roles || [];
    
    // Determine user role based on Keycloak roles
    let role = 'user';
    if (roles.includes('admin')) role = 'admin';
    else if (roles.includes('manager')) role = 'manager';
    
    // Create a session token for the application
    const sessionToken = jwt.sign(
      { 
        email: userInfo.email || userInfo.preferred_username, 
        name: `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || userInfo.preferred_username,
        role: role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token: sessionToken });
  } catch (error) {
    console.error('Token verification error:', error.response?.data || error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Serve the dashboard SPA from /dashboard path
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// SPA fallback for dashboard routes
app.get('/dashboard/*', (req, res) => {
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