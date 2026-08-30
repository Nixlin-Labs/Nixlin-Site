const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const next = require('next');
const cors = require('cors');
const { connectToDatabase } = require('../lib/mongodb');
const contactRoutes = require('../routes/contactRoutes');
const askRoutes = require('../routes/askRoutes');
const errorHandler = require('../middleware/errorHandler');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.join(__dirname, '..') });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Security and body parsing middlewares
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Connect to DB on boot
  connectToDatabase().catch((err) => {
    console.warn('⚠️ Warning: Initial MongoDB connection could not be established:', err.message);
  });

  // Backend API Endpoints
  server.use('/api/contact', contactRoutes);
  server.use('/api/ask', askRoutes);

  // Next.js request handling for all frontend routes
  server.all('{*path}', (req, res) => {
    return handle(req, res);
  });

  // Centralized Error Handling
  server.use(errorHandler);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Nixlin server ready on http://localhost:${port} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
