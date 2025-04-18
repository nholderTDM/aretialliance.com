const http = require('http');
const fs = require('fs');
const path = require('path');

// Port to listen on
const PORT = 3000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Parse URL
  let filePath;
  
  // Handle API endpoint
  if (req.url.startsWith('/auth/token') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: true, 
        token: 'test-token',
        message: 'This is a test token for development'
      }));
    });
    
    return;
  }
  
  // Handle static files
  if (req.url === '/') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (req.url.startsWith('/dashboard')) {
    // Check if it's a specific file in the dashboard directory
    const dashboardPath = req.url.replace('/dashboard', '');
    
    if (dashboardPath === '' || dashboardPath === '/') {
      filePath = path.join(__dirname, 'dashboard', 'index.html');
    } else {
      filePath = path.join(__dirname, 'dashboard', dashboardPath);
    }
  } else {
    // Serve from public directory
    filePath = path.join(__dirname, 'public', req.url);
  }
  
  // Get file extension
  const extname = path.extname(filePath);
  
  // Default content type
  let contentType = MIME_TYPES[extname] || 'text/plain';
  
  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard`);
});