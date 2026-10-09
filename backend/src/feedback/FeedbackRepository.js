const Feedback = require('./Feedback');

function findByUser(userId) {
  return Feedback.find({ user: userId })
    .populate({ path: 'version', populate: { path: 'software', select: 'software_name' } })
    .sort({ created_at: -1 });
}

function findByUserAndVersion(userId, versionId) {
  return Feedback.findOne({ user: userId, version: versionId });
}

function findByVersionIds(versionIds) {
  return Feedback.find({ version: { $in: versionIds } })
    .populate('user', 'full_name email')
    .sort({ created_at: -1 });
}

function create(data) {
  return Feedback.create(data);
}

function findByIdWithVersion(id) {
  return Feedback.findById(id).populate({
    path: 'version',
    populate: { path: 'software', select: 'software_name' },
  });
}

function deleteByUser(userId) {
  return Feedback.deleteMany({ user: userId });
}

module.exports = {
  findByUser,
  findByUserAndVersion,
  findByVersionIds,
  create,
  findByIdWithVersion,
  deleteByUser,
};
