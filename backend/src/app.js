const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/ErrorMiddleware');
const { logRequest } = require('./middleware/LoggingMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.get('/api/health', (req, res) => {
  res.json({ ok: true, name: 'Software License Management System' });
});

app.use('/api/auth', require('./auth/auth.routes'));
app.use('/api/users', require('./users/user.routes'));
app.use('/api/software', require('./software/software.routes'));
app.use('/api/versions', require('./versions/version.routes'));
app.use('/api/licenses', require('./licenses/license.routes'));
app.use('/api/feedback', require('./feedback/feedback.routes'));
app.use('/api/notifications', require('./notifications/notification.routes'));

app.use(errorHandler);

module.exports = app;
