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
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize data
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3004'],
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

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const startServer = (port) => {
      return new Promise((resolve, reject) => {
        console.log(`Attempting to start server on port ${port}...`);
        const server = app.listen(port)
          .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              const nextPort = parseInt(port) + 1;
              if (nextPort > 65535) {
                reject(new Error('No available ports found'));
                return;
              }
              console.log(`Port ${port} is busy, trying ${nextPort}`);
              resolve(startServer(nextPort));
            } else {
              console.error('Server error:', err);
              reject(err);
            }
          })
          .on('listening', () => {
            console.log(`Server is running on port ${port}`);
            console.log('Available routes:');
            const printRoutes = (stack, prefix = '') => {
              stack.forEach((r) => {
                if (r.route) {
                  // Direct route
                  console.log(`${Object.keys(r.route.methods).join(',').toUpperCase()} ${prefix}${r.route.path}`);
                } else if (r.name === 'router') {
                  // Mounted router
                  const newPrefix = prefix + (r.regexp.source
                    .replace('^\\/','/')
                    .replace('\\/?(?=\\/|$)','')
                    .replace(/\\\//g, '/'));
                  printRoutes(r.handle.stack, newPrefix);
                }
              });
            };
            printRoutes(app._router.stack);
            resolve(server);
          });
      });
    };

    startServer(process.env.PORT || 5000)
      .then(server => {
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
          console.error('Unhandled Rejection:', err);
          // Close server & exit process
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
      })
      .catch(err => {
        console.error('Server error:', err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

module.exports = app;
