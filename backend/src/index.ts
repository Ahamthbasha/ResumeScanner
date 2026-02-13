import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import userRoutes from './routes/userRouter';
import adminRoutes from './routes/adminRouter'
import AppError from './utils/appError';
import "./models/index"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
 // This will drop and recreate the table
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging - remove unused parameters
app.use((req, _res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// ============ ROUTES ============
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/user', userRoutes);
app.use('/api/admin',adminRoutes)

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Resume Scanner API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============ ERROR HANDLING ============
// 404 handler - remove unused parameters
app.use('*', (req, _res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
});

// Global error handler - remove unused parameters
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error('❌ Error:', err);
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ============ START SERVER ============
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(`🚀 Server started on port ${PORT}`);
      console.log('='.repeat(50));
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📍 Health: http://localhost:${PORT}/health`);
      console.log(`📍 Auth: http://localhost:${PORT}/api/v1/auth`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;