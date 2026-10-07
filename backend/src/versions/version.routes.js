const express = require('express');
const VersionService = require('./VersionService');
const { asyncHandler } = require('../middleware/ErrorMiddleware');
const { protect } = require('../middleware/AuthMiddleware');
const { isAdmin } = require('../middleware/RoleMiddleware');
const { ok, created } = require('../utils/ApiResponse');

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  ok(res, await VersionService.list());
}));

router.post('/', protect, isAdmin, asyncHandler(async (req, res) => {
  created(res, await VersionService.create(req.body));
}));

router.delete('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await VersionService.remove(req.params.id));
}));

module.exports = router;
