const BaseController = require('./BaseController');

class LicenseController extends BaseController {
  constructor(licenseService) {
    super();
    this.licenseService = licenseService;
  }

  mine = async (req, res) => {
    this.ok(res, await this.licenseService.listForUser(req.user._id));
  };

  list = async (req, res) => {
    this.ok(res, await this.licenseService.listAll());
  };

  create = async (req, res) => {
    this.created(res, await this.licenseService.create(req.user, req.body));
  };

  updateStatus = async (req, res) => {
    this.ok(res, await this.licenseService.updateStatus(req.params.id, req.body.status));
  };

  cancel = async (req, res) => {
    this.ok(res, await this.licenseService.cancel(req.params.id, req.user));
  };

  remove = async (req, res) => {
    this.ok(res, await this.licenseService.remove(req.params.id));
  };
}

module.exports = LicenseController;
