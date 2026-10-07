const express = require('express');
const NotificationService = require('./NotificationService');
const { asyncHandler } = require('../middleware/ErrorMiddleware');
const { protect } = require('../middleware/AuthMiddleware');
const { ok } = require('../utils/ApiResponse');

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  ok(res, await NotificationService.listForUser(req.user._id));
}));

module.exports = router;
