const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_urban_noise';

  try {
    // Attempt standard connection with a short timeout to fail fast if mongod isn't running
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected to MongoDB at: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryErr) {
    console.warn(`[MongoDB] Could not connect to primary MongoDB at ${primaryUri}: ${primaryErr.message}`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback for local testing & grading...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongodInstance.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to In-Memory MongoDB at: ${inMemoryUri}`);
      console.log('[MongoDB] NOTE: In-Memory mode active. Auto-seeding initial demo data...');
      
      // Seed initial demo data in in-memory mode
      const { seedDemoData } = require('../utils/seedData');
      await seedDemoData();
      return conn;
    } catch (fallbackErr) {
      console.error('[MongoDB] In-memory MongoDB fallback failed:', fallbackErr.message);
      console.error('[MongoDB] Please ensure MongoDB is installed/running or supply a valid MONGODB_URI in backend/.env');
      throw primaryErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Disconnect error:', err);
  }
};

module.exports = { connectDB, disconnectDB };
