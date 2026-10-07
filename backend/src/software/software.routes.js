const express = require('express');
const SoftwareService = require('./SoftwareService');
const { asyncHandler } = require('../middleware/ErrorMiddleware');
const { protect } = require('../middleware/AuthMiddleware');
const { isAdmin } = require('../middleware/RoleMiddleware');
const { ok, created } = require('../utils/ApiResponse');

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  ok(res, await SoftwareService.list());
}));

router.get('/:id', protect, asyncHandler(async (req, res) => {
  ok(res, await SoftwareService.getById(req.params.id));
}));

router.post('/', protect, isAdmin, asyncHandler(async (req, res) => {
  created(res, await SoftwareService.create(req.body));
}));

router.put('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await SoftwareService.update(req.params.id, req.body));
}));

router.delete('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await SoftwareService.remove(req.params.id));
}));

module.exports = router;
