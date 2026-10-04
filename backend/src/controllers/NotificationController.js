const BaseController = require('./BaseController');

class NotificationController extends BaseController {
  constructor(notificationService) {
    super();
    this.notificationService = notificationService;
  }

  list = async (req, res) => {
    this.ok(res, await this.notificationService.listForUser(req.user._id));
  };
}

module.exports = NotificationController;
