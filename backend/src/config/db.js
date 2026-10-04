const mongoose = require('mongoose');

async function connectLocal(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
  console.log('Connected to MongoDB');
}

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/software_license_manager';
  mongoose.set('strictQuery', true);

  if (process.env.MONGODB_URI) {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      dbName: 'software_license_manager',
    });
    console.log('Connected to MongoDB');
    return;
  }

  try {
    await connectLocal(uri);
    return;
  } catch (err) {
    console.warn('Local MongoDB is not running. Starting an in-memory database for this session.');
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const memoryServer = await MongoMemoryServer.create();
  global.__mongoMemoryServer = memoryServer;
  await mongoose.connect(memoryServer.getUri());
  console.log('Connected to in-memory MongoDB');
}

module.exports = connectDB;
