const NotificationRepository = require('./NotificationRepository');

function listForUser(userId) {
  return NotificationRepository.findByUser(userId);
}

module.exports = { listForUser };
