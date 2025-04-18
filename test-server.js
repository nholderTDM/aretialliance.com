const express = require('express');
const app = express();
const port = 3001; // Using a different port to avoid conflicts

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});