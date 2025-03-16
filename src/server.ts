import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import visitorRoutes from './routes/visitorRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN?.split(',') || ['https://code-tracker-frontend-xyz.vercel.app']
    : ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true
}));
app.use(express.json());

// Basic rate limiting
const rateLimit = (windowMs: number, max: number): express.RequestHandler => {
  const requests = new Map<string, number[]>();
  
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userRequests = requests.get(ip) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter((time: number) => now - time < windowMs);
    
    if (validRequests.length >= max) {
      res.status(429).json({ message: 'Too many requests, please try again later.' });
      return;
    }
    
    validRequests.push(now);
    requests.set(ip, validRequests);
    next();
  };
};

// Apply rate limiting
app.use(rateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/visitors', visitorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB connection with better error handling
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//<username>:<password>@'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeforces_tracker')
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    
    // Only start the server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT}/api/visitors/stats to check visitor stats`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      codeName: err.codeName
    });
    process.exit(1);
  });

// Add error handler for MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Basic error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
}); 