const express = require('express');
const FeedbackService = require('./FeedbackService');
const { asyncHandler } = require('../middleware/ErrorMiddleware');
const { protect } = require('../middleware/AuthMiddleware');
const { isAdmin } = require('../middleware/RoleMiddleware');
const { ok, created } = require('../utils/ApiResponse');

const router = express.Router();

router.get('/mine', protect, asyncHandler(async (req, res) => {
  ok(res, await FeedbackService.listForUser(req.user._id));
}));

router.get('/software/:softwareId', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await FeedbackService.listForSoftware(req.params.softwareId));
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  created(res, await FeedbackService.create(req.user, req.body));
}));

module.exports = router;
