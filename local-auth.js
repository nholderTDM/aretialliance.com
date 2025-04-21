const jwt = require('jsonwebtoken');

// Use the same JWT_SECRET as in your server.js
const JWT_SECRET = '3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f';

// Mock users for development
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

// Simple authentication function
const authenticate = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  
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
};

// Verify token function
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticate,
  verifyToken
};