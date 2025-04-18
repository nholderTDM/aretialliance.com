const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Basic middleware
app.use(express.json());
app.use(express.static('public'));

// Just a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Serve static dashboard
app.use('/dashboard', express.static('dashboard'));

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});