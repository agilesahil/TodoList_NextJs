import mongoose from 'mongoose';

/**
 * MongoDB Connection Utility
 * 
 * Optimized for Next.js App Router:
 * - Reuses existing connection if available
 * - Handles connection pooling automatically
 * - Prevents multiple connections in development
 */

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable (e.g. in .env.local for local, or in your host\'s env for production).'
  );
}

// On server/production, localhost MongoDB is not available — use MongoDB Atlas or another remote DB
const isServerOrProduction =
  typeof window === 'undefined' && (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production');
const isLocalhostUri =
  /^mongodb(\+srv)?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(MONGODB_URI) ||
  MONGODB_URI.includes('127.0.0.1') ||
  MONGODB_URI.includes('localhost:27017');
if (isServerOrProduction && isLocalhostUri) {
  throw new Error(
    'MONGODB_URI cannot point to localhost on the server. Set MONGODB_URI to a remote MongoDB (e.g. MongoDB Atlas) in your hosting dashboard (e.g. Vercel → Project → Settings → Environment Variables).'
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
