function getDatabaseConfig() {
  return {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/software_license_manager',
    hasCustomUri: Boolean(process.env.MONGODB_URI),
    dbName: 'software_license_manager',
  };
}

module.exports = { getDatabaseConfig };
