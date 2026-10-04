const BaseController = require('./BaseController');

class SoftwareController extends BaseController {
  constructor(softwareService) {
    super();
    this.softwareService = softwareService;
  }

  list = async (req, res) => {
    this.ok(res, await this.softwareService.list());
  };

  getOne = async (req, res) => {
    this.ok(res, await this.softwareService.getById(req.params.id));
  };

  create = async (req, res) => {
    this.created(res, await this.softwareService.create(req.body));
  };

  update = async (req, res) => {
    this.ok(res, await this.softwareService.update(req.params.id, req.body));
  };

  remove = async (req, res) => {
    this.ok(res, await this.softwareService.remove(req.params.id));
  };
}

module.exports = SoftwareController;
