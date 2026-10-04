const Software = require('../models/Software');
const SoftwareVersion = require('../models/SoftwareVersion');
const License = require('../models/License');
const AppError = require('../errors/AppError');

class VersionService {
  constructor(models = {}) {
    this.Software = models.Software || Software;
    this.SoftwareVersion = models.SoftwareVersion || SoftwareVersion;
    this.License = models.License || License;
  }

  async list() {
    const versions = await this.SoftwareVersion.find()
      .populate('software', 'software_name deleted_at')
      .sort({ release_date: -1, version_number: 1 });
    return versions.filter((version) => version.software && !version.software.deleted_at);
  }

  async create(body) {
    const softwareId = body.software;
    const versionNumber = String(body.version_number || '').trim();
    const releaseNotes = String(body.release_notes || '').trim();
    const releaseDate = body.release_date;

    if (!softwareId || !versionNumber || !releaseNotes || !releaseDate) {
      throw new AppError('Software, version, release date, and release notes are required.');
    }

    const software = await this.Software.findOne({ _id: softwareId, deleted_at: null });
    if (!software) throw new AppError('Software not found.', 404);

    const existing = await this.SoftwareVersion.findOne({ version_number: versionNumber });
    if (existing) throw new AppError('That version number is already in use.');

    const version = await this.SoftwareVersion.create({
      software: softwareId,
      version_number: versionNumber,
      release_notes: releaseNotes,
      release_date: new Date(releaseDate),
    });
    return version.populate('software', 'software_name');
  }

  async remove(id) {
    const inUse = await this.License.exists({ version_number: id });
    if (inUse) throw new AppError('This version is used by a license and cannot be deleted.');
    const version = await this.SoftwareVersion.findByIdAndDelete(id);
    if (!version) throw new AppError('Version not found.', 404);
    return { message: 'Version deleted.' };
  }
}

module.exports = VersionService;
