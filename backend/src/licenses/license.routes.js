const express = require('express');
const LicenseService = require('./LicenseService');
const LicenseFacade = require('./LicenseFacade');
const { asyncHandler } = require('../middleware/ErrorMiddleware');
const { protect } = require('../middleware/AuthMiddleware');
const { isAdmin } = require('../middleware/RoleMiddleware');
const { ok, created } = require('../utils/ApiResponse');

const router = express.Router();

router.get('/mine', protect, asyncHandler(async (req, res) => {
  ok(res, await LicenseService.listForUser(req.user._id));
}));

router.get('/', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await LicenseService.listAll());
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  created(res, await LicenseFacade.request(req.user, req.body));
}));

router.patch('/:id/status', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await LicenseFacade.review(req.params.id, req.body.status));
}));

router.patch('/:id/cancel', protect, asyncHandler(async (req, res) => {
  ok(res, await LicenseFacade.cancel(req.params.id, req.user));
}));

router.delete('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
  ok(res, await LicenseService.remove(req.params.id));
}));

module.exports = router;
