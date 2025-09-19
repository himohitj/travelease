import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// PostgreSQL connection via Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// MongoDB connection
export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelease';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

// Connect to both databases
export const connectDatabases = async (): Promise<void> => {
  try {
    // Test PostgreSQL connection
    await prisma.$connect();
    logger.info('PostgreSQL connected successfully');
    
    // Connect to MongoDB
    await connectMongoDB();
    
    logger.info('All databases connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

// Graceful shutdown
export const disconnectDatabases = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    await mongoose.disconnect();
    logger.info('All databases disconnected successfully');
  } catch (error) {
    logger.error('Database disconnection error:', error);
  }
};