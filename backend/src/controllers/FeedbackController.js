const BaseController = require('./BaseController');

class FeedbackController extends BaseController {
  constructor(feedbackService) {
    super();
    this.feedbackService = feedbackService;
  }

  mine = async (req, res) => {
    this.ok(res, await this.feedbackService.listForUser(req.user._id));
  };

  create = async (req, res) => {
    this.created(res, await this.feedbackService.create(req.user, req.body));
  };
}

module.exports = FeedbackController;
