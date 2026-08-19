const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./src/config/env');
const errorHandler = require('./src/middleware/error.middleware');
const { apiLimiter } = require('./src/middleware/rateLimit.middleware');

// Routes
const authRoutes = require('./src/routes/auth.routes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
const corsOptions = {
  origin: ['http://localhost:5174', 'https://dribbl.net', 'https://www.dribbl.net'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`\n[${timestamp}] [INCOMING REQUEST] ${req.method} ${req.originalUrl}`);
  console.log(`[REQUEST BODY]`, JSON.stringify(req.body, null, 2));
  
  // Capture response
  const originalSend = res.send;
  res.send = function (body) {
    res.locals.body = body;
    return originalSend.call(this, body);
  };
  const originalJson = res.json;
  res.json = function (body) {
    res.locals.body = body;
    return originalJson.call(this, body);
  };
  
  // Hook into response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[RESPONSE SENT] ${res.statusCode} for ${req.method} ${req.originalUrl} - ${duration}ms`);
    if (res.locals.body) {
      console.log(`[RESPONSE BODY]`, res.locals.body);
    }
  });
  next();
});

// Apply global API rate limiter
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// Root route for Render health checks
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: "FootballHub Backend",
    status: "healthy"
  });
});
app.head('/', (req, res) => {
  res.status(200).end();
});

// Handle 404
app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  err.errorCode = 'NOT_FOUND';
  next(err);
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(env.port, '0.0.0.0', () => {
  console.log(`Server listening on:
http://0.0.0.0:${env.port}`);
});
