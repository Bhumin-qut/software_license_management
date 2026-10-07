const mongoose = require('mongoose');

class MongoServerConnection {
  async openServer(uri, options) {
    await mongoose.connect(uri, options);
  }
}

module.exports = MongoServerConnection;
