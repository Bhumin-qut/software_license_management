const mongoose = require('mongoose');

class DatabaseConnectionAdapter {
  constructor(connection) {
    this.connection = connection;
  }

  async connect(uri, options) {
    if (typeof this.connection.openServer === 'function') {
      await this.connection.openServer(uri, options);
      return;
    }

    const memoryUri = await this.connection.startInMemory();
    await mongoose.connect(memoryUri);
  }
}

module.exports = DatabaseConnectionAdapter;
