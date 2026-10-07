class MemoryDatabaseConnection {
  async startInMemory() {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    global.__mongoMemoryServer = memoryServer;
    return memoryServer.getUri();
  }
}

module.exports = MemoryDatabaseConnection;
