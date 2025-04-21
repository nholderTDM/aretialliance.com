const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// JWT Secret
const JWT_SECRET = '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

// Simple in-memory user database
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

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
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

// Login route
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

// Example protected route
app.get('/api/data', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Website: http://localhost:${port}`);
  console.log(`Dashboard: http://localhost:${port}/dashboard`);
});