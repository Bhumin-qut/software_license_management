require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const DatabaseSeeder = require('./src/seed/DatabaseSeeder');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/error');

const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => {
  res.json({ ok: true, name: 'Software License Management System' });
});
app.use('/api', routes);
app.use(errorHandler.handle);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => new DatabaseSeeder().run())
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
