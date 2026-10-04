const BaseController = require('./BaseController');

class VersionController extends BaseController {
  constructor(versionService) {
    super();
    this.versionService = versionService;
  }

  list = async (req, res) => {
    this.ok(res, await this.versionService.list());
  };

  create = async (req, res) => {
    this.created(res, await this.versionService.create(req.body));
  };

  remove = async (req, res) => {
    this.ok(res, await this.versionService.remove(req.params.id));
  };
}

module.exports = VersionController;
