const express = require('express');
const FeedbackService = require('./FeedbackService');
const { asyncHandler } = require('../middleware/ErrorMiddleware');
const { protect } = require('../middleware/AuthMiddleware');
const { ok, created } = require('../utils/ApiResponse');

const router = express.Router();

router.get('/mine', protect, asyncHandler(async (req, res) => {
  ok(res, await FeedbackService.listForUser(req.user._id));
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  created(res, await FeedbackService.create(req.user, req.body));
}));

module.exports = router;
