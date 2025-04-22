const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { authenticate, verifyToken } = require('./local-auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dashboard')));

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const result = authenticate(username, password);
    
    if (!result) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
        token: result.token,
        user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
        }
    });
});

// Protected route example
app.get('/api/user/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const user = verifyToken(token);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.json({ user });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});