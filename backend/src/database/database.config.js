function databaseName(uri) {
  const withoutScheme = String(uri).replace(/^mongodb(\+srv)?:\/\//, '');
  const path = withoutScheme.split('/').slice(1).join('/');
  const name = path.split('?')[0];
  return name || 'software_license_manager';
}

function getDatabaseConfig() {
  const uri = process.env.MONGODB_URI;
  return {
    uri,
    hasCustomUri: Boolean(process.env.MONGODB_URI),
    dbName: process.env.MONGODB_DB_NAME,
  };
}

module.exports = { getDatabaseConfig };
