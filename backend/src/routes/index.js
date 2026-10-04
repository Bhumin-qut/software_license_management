const express = require('express');
const { asyncHandler } = require('../middleware/error');
const auth = require('../middleware/auth');
const {
  authController,
  userController,
  softwareController,
  versionController,
  licenseController,
  feedbackController,
  notificationController,
} = require('../container');

const router = express.Router();

router.post('/auth/register', asyncHandler(authController.register));
router.post('/auth/login', asyncHandler(authController.login));
router.post('/auth/forgot-password', asyncHandler(authController.forgotPassword));
router.get('/auth/me', auth.protect, asyncHandler(authController.me));

router.put('/users/me', auth.protect, asyncHandler(userController.updateMe));
router.put('/users/me/password', auth.protect, asyncHandler(userController.updatePassword));
router.get('/users', auth.protect, auth.admin, asyncHandler(userController.list));
router.post('/users', auth.protect, auth.admin, asyncHandler(userController.create));
router.put('/users/:id', auth.protect, auth.admin, asyncHandler(userController.update));
router.patch('/users/:id/status', auth.protect, auth.admin, asyncHandler(userController.updateStatus));
router.delete('/users/:id', auth.protect, auth.admin, asyncHandler(userController.remove));

router.get('/software', auth.protect, asyncHandler(softwareController.list));
router.get('/software/:id', auth.protect, asyncHandler(softwareController.getOne));
router.post('/software', auth.protect, auth.admin, asyncHandler(softwareController.create));
router.put('/software/:id', auth.protect, auth.admin, asyncHandler(softwareController.update));
router.delete('/software/:id', auth.protect, auth.admin, asyncHandler(softwareController.remove));

router.get('/versions', auth.protect, asyncHandler(versionController.list));
router.post('/versions', auth.protect, auth.admin, asyncHandler(versionController.create));
router.delete('/versions/:id', auth.protect, auth.admin, asyncHandler(versionController.remove));

router.get('/licenses/mine', auth.protect, asyncHandler(licenseController.mine));
router.get('/licenses', auth.protect, auth.admin, asyncHandler(licenseController.list));
router.post('/licenses', auth.protect, asyncHandler(licenseController.create));
router.patch('/licenses/:id/status', auth.protect, auth.admin, asyncHandler(licenseController.updateStatus));
router.patch('/licenses/:id/cancel', auth.protect, asyncHandler(licenseController.cancel));
router.delete('/licenses/:id', auth.protect, auth.admin, asyncHandler(licenseController.remove));

router.get('/feedback/mine', auth.protect, asyncHandler(feedbackController.mine));
router.post('/feedback', auth.protect, asyncHandler(feedbackController.create));

router.get('/notifications', auth.protect, asyncHandler(notificationController.list));

module.exports = router;
