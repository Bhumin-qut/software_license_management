const FeedbackRepository = require('./FeedbackRepository');
const VersionRepository = require('../versions/VersionRepository');
const { createError } = require('../middleware/ErrorMiddleware');

function listForUser(userId) {
  return FeedbackRepository.findByUser(userId);
}

async function listForSoftware(softwareId) {
  const versions = await VersionRepository.findBySoftware(softwareId);
  if (!versions.length) return [];
  return FeedbackRepository.findByVersionIds(versions.map((version) => version._id));
}

async function create(user, body) {
  const versionId = body.version;
  const comments = String(body.comments || '').trim();
  const rating = Number(body.rating);

  if (!versionId) throw createError('Software version is required.');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw createError('Rating must be a whole number from 1 to 5.');
  }
  if (!comments) throw createError('Comments are required.');

  const version = await VersionRepository.findById(versionId);
  if (!version) throw createError('Version not found.', 404);

  const existing = await FeedbackRepository.findByUserAndVersion(user._id, version._id);
  if (existing) throw createError('You already submitted feedback for this version.');

  const feedback = await FeedbackRepository.create({
    version: version._id,
    user: user._id,
    rating,
    comments,
  });

  return FeedbackRepository.findByIdWithVersion(feedback._id);
}

module.exports = { listForUser, listForSoftware, create };
