const mongoose = require('mongoose');
const { getDatabaseConfig } = require('./database.config');
const MongoServerConnection = require('./MongoServerConnection');
const MemoryDatabaseConnection = require('./MemoryDatabaseConnection');
const DatabaseConnectionAdapter = require('./DatabaseConnectionAdapter');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connected = false;
    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    if (this.connected) return;

    const config = getDatabaseConfig();
    mongoose.set('strictQuery', true);
    const mongoServer = new MongoServerConnection();
    const memoryDatabase = new MemoryDatabaseConnection();

    if (config.hasCustomUri) {
      const adapter = new DatabaseConnectionAdapter(mongoServer);
      await adapter.connect(config.uri, {
        serverSelectionTimeoutMS: 30000,
        dbName: config.dbName,
      });
      console.log('Connected to MongoDB');
      this.connected = true;
      return;
    }

    try {
      const adapter = new DatabaseConnectionAdapter(mongoServer);
      await adapter.connect(config.uri, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to MongoDB');
      this.connected = true;
      return;
    } catch (err) {
      console.warn('Local MongoDB is not running. Starting an in-memory database for this session.');
    }

    const adapter = new DatabaseConnectionAdapter(memoryDatabase);
    await adapter.connect();
    console.log('Connected to in-memory MongoDB');
    this.connected = true;
  }
}

module.exports = Database;
