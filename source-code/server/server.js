const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!'
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to E-Vidya Saathi API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/placements', require('./routes/placement.routes'));
app.use('/api/matching', require('./routes/matching.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/interests', require('./routes/interest.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log('Available routes:');
      printRoutes(app._router.stack);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Helper function to print routes
const printRoutes = (stack, prefix = '') => {
  stack.forEach((r) => {
    if (r.route) {
      console.log(`${Object.keys(r.route.methods).join(',').toUpperCase()} ${prefix}${r.route.path}`);
    } else if (r.name === 'router') {
      const newPrefix = prefix + (r.regexp.source
        .replace('^\\/','/')
        .replace('\\/?(?=\\/|$)','')
        .replace(/\\\//g, '/'));
      printRoutes(r.handle.stack, newPrefix);
    }
  });
};

// Start the server
startServer();

module.exports = app;
