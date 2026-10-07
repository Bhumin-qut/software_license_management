const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  version: { type: mongoose.Schema.Types.ObjectId, ref: 'software_version', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('feedback', feedbackSchema);
