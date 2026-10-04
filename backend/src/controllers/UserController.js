const BaseController = require('./BaseController');

class UserController extends BaseController {
  constructor(userService) {
    super();
    this.userService = userService;
  }

  list = async (req, res) => {
    this.ok(res, await this.userService.list());
  };

  create = async (req, res) => {
    this.created(res, await this.userService.create(req.body));
  };

  update = async (req, res) => {
    this.ok(res, await this.userService.update(req.params.id, req.body, req.user));
  };

  updateStatus = async (req, res) => {
    this.ok(res, await this.userService.updateStatus(req.params.id, req.body.status, req.user));
  };

  remove = async (req, res) => {
    this.ok(res, await this.userService.remove(req.params.id, req.user));
  };

  updateMe = async (req, res) => {
    this.ok(res, await this.userService.updateMe(req.user, req.body));
  };

  updatePassword = async (req, res) => {
    this.ok(res, await this.userService.updatePassword(req.user, req.body));
  };
}

module.exports = UserController;
