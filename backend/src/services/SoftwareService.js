const Software = require('../models/Software');
const SoftwareVersion = require('../models/SoftwareVersion');
const AppError = require('../errors/AppError');

class SoftwareService {
  constructor(models = {}) {
    this.Software = models.Software || Software;
    this.SoftwareVersion = models.SoftwareVersion || SoftwareVersion;
  }

  async withLatestVersion(items) {
    const ids = items.map((item) => item._id);
    const versions = await this.SoftwareVersion.find({ software: { $in: ids } }).sort({ release_date: -1, _id: -1 });
    const latest = new Map();
    versions.forEach((version) => {
      const key = String(version.software);
      if (!latest.has(key)) latest.set(key, version);
    });
    return items.map((item) => ({
      ...item.toObject(),
      latest_version: latest.get(String(item._id)) || null,
    }));
  }

  async list() {
    const items = await this.Software.find({ deleted_at: null }).sort({ created_at: 1, software_name: 1 });
    return this.withLatestVersion(items);
  }

  async getById(id) {
    const software = await this.Software.findOne({ _id: id, deleted_at: null });
    if (!software) throw new AppError('Software not found.', 404);
    const versions = await this.SoftwareVersion.find({ software: software._id }).sort({ release_date: -1 });
    return { ...software.toObject(), versions, latest_version: versions[0] || null };
  }

  async create(body) {
    const name = String(body.software_name || '').trim();
    if (!name) throw new AppError('Software name is required.');
    const existing = await this.Software.findOne({ software_name: name, deleted_at: null });
    if (existing) throw new AppError('That software name already exists.');
    return this.Software.create({ software_name: name });
  }

  async update(id, body) {
    const name = String(body.software_name || '').trim();
    if (!name) throw new AppError('Software name is required.');

    const software = await this.Software.findOne({ _id: id, deleted_at: null });
    if (!software) throw new AppError('Software not found.', 404);

    const existing = await this.Software.findOne({ software_name: name, deleted_at: null, _id: { $ne: software._id } });
    if (existing) throw new AppError('That software name already exists.');

    software.software_name = name;
    await software.save();
    return software;
  }

  async remove(id) {
    const software = await this.Software.findOne({ _id: id, deleted_at: null });
    if (!software) throw new AppError('Software not found.', 404);
    software.deleted_at = new Date();
    await software.save();
    return { message: 'Software removed.' };
  }
}

module.exports = SoftwareService;
