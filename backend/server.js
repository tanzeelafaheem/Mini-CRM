const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// CORS setup
const allowedOrigin = 'https://mini-crm-1-1ur8.onrender.com';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/customers', require('./routes/customer'));
app.use('/api/leads', require('./routes/lead'));

// Root route
app.get('/', (req, res) => {
  res.send('Mini-CRM API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
