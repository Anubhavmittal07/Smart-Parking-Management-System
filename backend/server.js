const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// --- Mock API Endpoints (Simple Backend) ---

// 1. Get all slots
app.get('/api/slots', (req, res) => {
  res.json({ message: "API is working! Slots data would go here." });
});

// 2. Auth login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'driver@demo.com' && password === 'password123') {
    res.json({ token: 'mock-jwt-token', user: { role: 'driver', email } });
  } else if (email === 'admin@demo.com' && password === 'admin123') {
    res.json({ token: 'mock-admin-token', user: { role: 'admin', email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Fallback to serve index.html for unknown routes (for SPA behavior if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
