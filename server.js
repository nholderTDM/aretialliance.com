const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve the public directory for the main website
app.use(express.static(path.join(__dirname, 'public')));

// Serve the dashboard SPA
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Simple auth endpoint for testing
app.post('/auth/token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  
  // For testing purposes, just create a session token
  const sessionToken = jwt.sign(
    { 
      email: 'test@example.com', 
      name: 'Test User',
      role: 'admin',
    },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '24h' }
  );
  
  res.json({ success: true, token: sessionToken });
});

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