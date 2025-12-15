import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import routes
import catalogRoutes from './routes/catalog.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Public Services API',
    version: '1.0.0',
    endpoints: {
      services: '/api/services',
      branches: '/api/branches',
      selectService: '/api/selections/service',
      selectBranch: '/api/selections/branch',
      openapi: '/openapi.yaml'
    }
  });
});

// Serve OpenAPI spec
app.get('/openapi.yaml', (req, res) => {
  const openapiPath = path.join(__dirname, '..', 'resources', 'openapi.yaml');
  if (fs.existsSync(openapiPath)) {
    res.type('application/yaml');
    res.sendFile(openapiPath);
  } else {
    res.status(404).json({ error: 'OpenAPI spec not found' });
  }
});

// API Routes
app.use('/api', catalogRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'The requested resource was not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API docs: http://localhost:${PORT}/openapi.yaml`);
});

export default app;
