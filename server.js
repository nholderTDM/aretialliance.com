const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Local authentication service
const localAuth = {
  authenticate: (username, password) => {
    // Simple user database
    const users = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin User',
        email: 'admin@aretialliance.com',
        role: 'admin'
      },
      {
        id: '2',
        username: 'user',
        password: 'user123',
        name: 'Regular User',
        email: 'user@aretialliance.com',
        role: 'user'
      }
    ];

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return null;
    
    // JWT Secret
    const JWT_SECRET = '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';
    
    // Create and return a token
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
};

const app = express();
const port = process.env.PORT || 3000;

// JWT Secret
const JWT_SECRET = '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

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

// Authentication routes
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

// Protected API endpoint
app.get('/api/data', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected data',
    user: req.user
  });
});

// Serve static files for the dashboard
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Serve static files for the main website
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard route handler
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