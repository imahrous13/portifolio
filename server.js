require('dotenv').config();
const express = require('express');
const path = require('path');
const contactHandler = require('./api/contact');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.post('/api/contact', contactHandler);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
