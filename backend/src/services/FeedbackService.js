const Feedback = require('../models/Feedback');
const SoftwareVersion = require('../models/SoftwareVersion');
const AppError = require('../errors/AppError');

class FeedbackService {
  constructor(models = {}) {
    this.Feedback = models.Feedback || Feedback;
    this.SoftwareVersion = models.SoftwareVersion || SoftwareVersion;
  }

  listForUser(userId) {
    return this.Feedback.find({ user: userId })
      .populate({ path: 'version', populate: { path: 'software', select: 'software_name' } })
      .sort({ created_at: -1 });
  }

  async create(user, body) {
    const versionId = body.version;
    const comments = String(body.comments || '').trim();
    const rating = Number(body.rating);

    if (!versionId) throw new AppError('Software version is required.');
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new AppError('Rating must be a whole number from 1 to 5.');
    }
    if (!comments) throw new AppError('Comments are required.');

    const version = await this.SoftwareVersion.findById(versionId);
    if (!version) throw new AppError('Version not found.', 404);

    const existing = await this.Feedback.findOne({ user: user._id, version: version._id });
    if (existing) throw new AppError('You already submitted feedback for this version.');

    const feedback = await this.Feedback.create({
      version: version._id,
      user: user._id,
      rating,
      comments,
    });

    return this.Feedback.findById(feedback._id).populate({
      path: 'version',
      populate: { path: 'software', select: 'software_name' },
    });
  }
}

module.exports = FeedbackService;
