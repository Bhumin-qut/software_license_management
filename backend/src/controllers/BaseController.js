class BaseController {
  ok(res, data) {
    res.json(data);
  }

  created(res, data) {
    res.status(201).json(data);
  }
}

module.exports = BaseController;
