const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Environment variables with exact values from your configuration
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://auth.aretialliance.com';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'areti-alliance';
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'areti-crm-client';
const JWT_SECRET = process.env.JWT_SECRET || '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging with detailed information
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${req.headers['authorization'] ? 'with auth' : 'no auth'}`);
  next();
});

// Authentication middleware for protected routes
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Authorization header found');
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received, length:', token.length);
    
    try {
      // First try to validate with our own JWT secret
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log('Local token validated successfully for user:', decoded.email);
      return next();
    } catch (localJwtError) {
      console.log('Local token validation failed:', localJwtError.message);
      
      // If local validation fails, try validating with Keycloak
      try {
        // Verify Keycloak token by calling userinfo endpoint
        console.log('Verifying with Keycloak at:', `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`);
        const keycloakResponse = await axios.get(
          `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const userInfo = keycloakResponse.data;
        console.log('Keycloak token validated successfully for user:', userInfo.preferred_username);
        
        // Extract roles from token and determine user role
        const roles = userInfo.realm_access?.roles || [];
        console.log('User roles:', roles);
        
        let role = 'user';
        if (roles.includes('admin')) role = 'admin';
        else if (roles.includes('manager')) role = 'manager';
        
        // Set user info in request
        req.user = {
          email: userInfo.email || userInfo.preferred_username,
          name: `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || userInfo.preferred_username,
          role: role,
          sub: userInfo.sub // Add Keycloak subject ID
        };
        
        return next();
      } catch (keycloakError) {
        console.log('Keycloak validation failed:', keycloakError.response?.status, keycloakError.message);
        return res.status(401).json({ 
          error: 'Unauthorized - Invalid token',
          message: 'Token validation failed. Please log in again.'
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized - Authentication error' });
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
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// User profile endpoint
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    user: req.user,
    serverTime: new Date().toISOString()
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
    console.log('Verifying token at Keycloak userinfo endpoint');
    const keycloakResponse = await axios.get(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    const userInfo = keycloakResponse.data;
    console.log('User info received from Keycloak:', userInfo.preferred_username);
    
    // Extract roles from token
    const roles = userInfo.realm_access?.roles || [];
    console.log('User roles:', roles);
    
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
        kc_id: userInfo.sub,
        kc_username: userInfo.preferred_username,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token: sessionToken,
      user: {
        name: `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || userInfo.preferred_username,
        email: userInfo.email || userInfo.preferred_username,
        role: role
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Token verification error:', error.response?.data || error.message);
    res.status(401).json({ 
      error: 'Invalid token',
      message: error.response?.data?.error_description || error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    environment: {
      keycloakUrl: KEYCLOAK_URL,
      realm: KEYCLOAK_REALM,
      clientId: KEYCLOAK_CLIENT_ID
    }
  });
});

// Debugging endpoint to check if server configuration is correct
app.get('/debug/config', (req, res) => {
  res.json({
    keycloakUrl: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
    // Don't expose the full JWT secret
    jwtSecretFirstChars: JWT_SECRET.substring(0, 4) + '...',
    nodeEnv: process.env.NODE_ENV || 'not set',
    port: port,
    serverTime: new Date().toISOString()
  });
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
  console.log(`Environment: KEYCLOAK_URL=${KEYCLOAK_URL}, REALM=${KEYCLOAK_REALM}, CLIENT_ID=${KEYCLOAK_CLIENT_ID}`);
});