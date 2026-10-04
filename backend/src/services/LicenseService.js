const License = require('../models/License');
const Software = require('../models/Software');
const SoftwareVersion = require('../models/SoftwareVersion');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AppError = require('../errors/AppError');

class LicenseService {
  constructor(models = {}) {
    this.License = models.License || License;
    this.Software = models.Software || Software;
    this.SoftwareVersion = models.SoftwareVersion || SoftwareVersion;
    this.User = models.User || User;
    this.Notification = models.Notification || Notification;
  }

  withDetails(query) {
    return query
      .populate('user', 'full_name email role')
      .populate('assigned_software', 'software_name')
      .populate('version_number', 'version_number')
      .sort({ requested_at: -1 });
  }

  listForUser(userId) {
    return this.withDetails(this.License.find({ user: userId }));
  }

  listAll() {
    return this.withDetails(this.License.find());
  }

  async create(user, body) {
    const reason = String(body.reason || '').trim();
    const softwareId = body.assigned_software;
    const versionId = body.version_number;

    if (!softwareId) throw new AppError('Software is required.');
    if (!reason) throw new AppError('Business reason is required.');
    if (reason.length > 500) throw new AppError('Reason must be 500 characters or fewer.');

    const software = await this.Software.findOne({ _id: softwareId, deleted_at: null });
    if (!software) throw new AppError('Software not found.', 404);

    let version = null;
    if (versionId) {
      version = await this.SoftwareVersion.findOne({ _id: versionId, software: software._id });
      if (!version) throw new AppError('Version does not belong to this software.');
    }

    const existing = await this.License.findOne({
      user: user._id,
      assigned_software: software._id,
      status: { $in: ['Pending', 'Approved'] },
    });
    if (existing) throw new AppError('You already have a pending or active license for this software.');

    const license = await this.License.create({
      user: user._id,
      assigned_software: software._id,
      version_number: version ? version._id : undefined,
      reason,
      status: 'Pending',
    });

    const admins = await this.User.find({ role: 'admin', status: 'active' });
    if (admins.length) {
      await this.Notification.insertMany(
        admins.map((admin) => ({
          user: admin._id,
          message: `${user.full_name} requested a license for ${software.software_name}.`,
        }))
      );
    }

    return this.withDetails(this.License.findById(license._id));
  }

  async updateStatus(id, status) {
    if (!['Approved', 'Rejected', 'Expired'].includes(status)) throw new AppError('Invalid status.');

    const license = await this.License.findById(id).populate('assigned_software', 'software_name');
    if (!license) throw new AppError('License not found.', 404);

    if ((status === 'Approved' || status === 'Rejected') && license.status !== 'Pending') {
      throw new AppError('Only pending requests can be approved or rejected.');
    }
    if (status === 'Expired' && license.status !== 'Approved') {
      throw new AppError('Only an active license can be revoked.');
    }

    license.status = status;
    license.reviewed_at = new Date();
    if (status === 'Approved') {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      license.expires_at = expires;
    }
    if (status === 'Expired') license.expires_at = new Date();
    await license.save();

    const softwareName = license.assigned_software?.software_name || 'software';
    const messages = {
      Approved: `Your request for ${softwareName} has been approved.`,
      Rejected: `Your request for ${softwareName} has been rejected.`,
      Expired: `Your license for ${softwareName} has been revoked.`,
    };
    await this.Notification.create({ user: license.user, message: messages[status] });
    return this.withDetails(this.License.findById(license._id));
  }

  async cancel(id, user) {
    const license = await this.License.findOne({ _id: id, user: user._id }).populate('assigned_software', 'software_name');
    if (!license) throw new AppError('License not found.', 404);
    if (license.status !== 'Approved') throw new AppError('Only active licenses can be cancelled.');

    license.status = 'Expired';
    license.expires_at = new Date();
    await license.save();

    await this.Notification.create({
      user: user._id,
      message: `Your subscription for ${license.assigned_software?.software_name || 'software'} has been cancelled.`,
    });
    return this.withDetails(this.License.findById(license._id));
  }

  async remove(id) {
    const license = await this.License.findByIdAndDelete(id);
    if (!license) throw new AppError('License not found.', 404);
    return { message: 'License deleted.' };
  }
}

module.exports = LicenseService;
