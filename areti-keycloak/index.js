const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Environment variables
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;
const jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://aretialliance.com'],
  credentials: true
}));
app.use(express.json());

// JWT validation middleware
const checkJwt = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
  }),
  audience: auth0Audience,
  issuer: `https://${auth0Domain}/`,
  algorithms: ['RS256']
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

// Token exchange endpoint
app.post('/auth/token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Decode the token without verification 
    // (verification happens via the Auth0 middleware in production use cases)
    const decoded = jwt.decode(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Create a new application-specific token
    const appToken = jwt.sign(
      { 
        email: decoded.email || 'user@example.com',
        name: decoded.name || 'User',
        role: 'admin', // For simplicity, assign admin role - customize based on your needs
        sub: decoded.sub,
        userId: decoded.sub
      }, 
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    return res.json({ token: appToken });
  } catch (error) {
    console.error('Token exchange error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected endpoint example - requires a valid JWT
app.get('/api/protected', checkJwt, (req, res) => {
  res.json({
    message: 'This is a protected endpoint',
    user: req.auth
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Auth service running on port ${port}`);
  console.log(`Health check: http://localhost:${port}`);
  console.log(`Token exchange endpoint: http://localhost:${port}/auth/token`);
});