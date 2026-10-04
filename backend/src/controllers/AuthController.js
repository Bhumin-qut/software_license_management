const BaseController = require('./BaseController');

class AuthController extends BaseController {
  constructor(authService) {
    super();
    this.authService = authService;
  }

  register = async (req, res) => {
    this.created(res, await this.authService.register(req.body));
  };

  login = async (req, res) => {
    this.ok(res, await this.authService.login(req.body));
  };

  me = async (req, res) => {
    const auth = require('../middleware/auth');
    this.ok(res, auth.publicUser(req.user));
  };

  forgotPassword = async (req, res) => {
    this.ok(res, await this.authService.forgotPassword(req.body));
  };
}

module.exports = AuthController;
