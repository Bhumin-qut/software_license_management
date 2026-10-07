const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = require('./app');
const Database = require('./database/Database');
const seedDatabase = require('./database/seed');

const port = process.env.PORT || 5000;

Database.getInstance()
  .connect()
  .then(() => seedDatabase())
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server.');
    console.error(err.message);
    process.exit(1);
  });
