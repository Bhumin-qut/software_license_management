const AuthService = require('./services/AuthService');
const UserService = require('./services/UserService');
const SoftwareService = require('./services/SoftwareService');
const VersionService = require('./services/VersionService');
const LicenseService = require('./services/LicenseService');
const FeedbackService = require('./services/FeedbackService');
const NotificationService = require('./services/NotificationService');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const SoftwareController = require('./controllers/SoftwareController');
const VersionController = require('./controllers/VersionController');
const LicenseController = require('./controllers/LicenseController');
const FeedbackController = require('./controllers/FeedbackController');
const NotificationController = require('./controllers/NotificationController');

const authController = new AuthController(new AuthService());
const userController = new UserController(new UserService());
const softwareController = new SoftwareController(new SoftwareService());
const versionController = new VersionController(new VersionService());
const licenseController = new LicenseController(new LicenseService());
const feedbackController = new FeedbackController(new FeedbackService());
const notificationController = new NotificationController(new NotificationService());

module.exports = {
  authController,
  userController,
  softwareController,
  versionController,
  licenseController,
  feedbackController,
  notificationController,
};
