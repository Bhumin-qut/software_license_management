const Notification = require('../models/Notification');

class NotificationService {
  constructor(notificationModel = Notification) {
    this.Notification = notificationModel;
  }

  listForUser(userId) {
    return this.Notification.find({ user: userId }).sort({ created_at: -1 });
  }
}

module.exports = NotificationService;
