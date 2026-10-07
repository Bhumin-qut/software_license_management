const Notification = require('./Notification');

function findByUser(userId) {
  return Notification.find({ user: userId }).sort({ created_at: -1 });
}

function insertMany(docs) {
  return Notification.insertMany(docs);
}

function create(data) {
  return Notification.create(data);
}

function deleteByUser(userId) {
  return Notification.deleteMany({ user: userId });
}

module.exports = { findByUser, insertMany, create, deleteByUser };
