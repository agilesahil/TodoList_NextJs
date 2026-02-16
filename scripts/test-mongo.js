// Quick script to test MongoDB connection using Mongoose
// Usage: node scripts/test-mongo.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not set in .env.local');
  process.exit(1);
}

console.log('Testing MongoDB URI:', uri);

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:');
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  });
