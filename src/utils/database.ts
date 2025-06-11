import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qrpro';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose?: MongooseCache;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = (global as GlobalWithMongoose).mongoose || { conn: null, promise: null };

if (!(global as GlobalWithMongoose).mongoose) {
  (global as GlobalWithMongoose).mongoose = cached;
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: 'qrpro'
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully to qrpro database');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

export const getConnection = (): typeof mongoose => {
  if (!cached.conn) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return cached.conn;
}; 