import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is not defined');
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      maxPoolSize: 10, // Maximum pool size for serverless
      minPoolSize: 1, // Minimum pool size
    };

    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Log masked URI for debugging
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log('📊 Connection state:', mongoose.connection.readyState);
      console.log('🏢 Database name:', mongoose.connection.name);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
      });
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('❌ MongoDB connection error during await:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
