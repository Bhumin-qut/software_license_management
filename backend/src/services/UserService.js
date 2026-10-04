const bcrypt = require('bcryptjs');
const User = require('../models/User');
const License = require('../models/License');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const AppError = require('../errors/AppError');
const Validator = require('../utils/Validator');
const auth = require('../middleware/auth');

class UserService {
  constructor(models = {}) {
    this.User = models.User || User;
    this.License = models.License || License;
    this.Feedback = models.Feedback || Feedback;
    this.Notification = models.Notification || Notification;
    this.tempPassword = 'Password123';
  }

  async list() {
    return this.User.find().select('-password_hash').sort({ full_name: 1 });
  }

  async create(body) {
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const role = body.role || 'user';
    const status = body.status || 'active';

    if (!fullName) throw new AppError('Full name is required.');
    if (!Validator.email(email)) throw new AppError('Enter a valid email address.');
    if (!['user', 'admin'].includes(role)) throw new AppError('Role must be user or admin.');
    if (!['active', 'blocked'].includes(status)) throw new AppError('Status must be active or blocked.');

    const existing = await this.User.findOne({ email });
    if (existing) throw new AppError('An account with this email already exists.');

    const user = await this.User.create({
      full_name: fullName,
      email,
      password_hash: await bcrypt.hash(this.tempPassword, 10),
      role,
      status,
    });
    return auth.publicUser(user);
  }

  async update(id, body, actor) {
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const { role, status } = body;

    if (!fullName) throw new AppError('Full name is required.');
    if (!Validator.email(email)) throw new AppError('Enter a valid email address.');
    if (role && !['user', 'admin'].includes(role)) throw new AppError('Role must be user or admin.');
    if (status && !['active', 'blocked'].includes(status)) throw new AppError('Status must be active or blocked.');

    const user = await this.User.findById(id);
    if (!user) throw new AppError('User not found.', 404);

    const editingSelf = actor._id.equals(user._id);
    if (editingSelf && ((role && role !== user.role) || (status && status !== user.status))) {
      throw new AppError('You cannot change your own role or status.');
    }

    const existing = await this.User.findOne({ email, _id: { $ne: user._id } });
    if (existing) throw new AppError('An account with this email already exists.');

    user.full_name = fullName;
    user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    await user.save();
    return auth.publicUser(user);
  }

  async updateStatus(id, status, actor) {
    if (!['active', 'blocked'].includes(status)) throw new AppError('Status must be active or blocked.');
    if (actor._id.equals(id) && status === 'blocked') throw new AppError('You cannot block your own account.');

    const user = await this.User.findByIdAndUpdate(id, { status }, { new: true }).select('-password_hash');
    if (!user) throw new AppError('User not found.', 404);
    return user;
  }

  async remove(id, actor) {
    if (actor._id.equals(id)) throw new AppError('You cannot delete your own account.');

    const user = await this.User.findByIdAndDelete(id);
    if (!user) throw new AppError('User not found.', 404);

    await Promise.all([
      this.License.deleteMany({ user: user._id }),
      this.Feedback.deleteMany({ user: user._id }),
      this.Notification.deleteMany({ user: user._id }),
    ]);
    return { message: 'User deleted.' };
  }

  async updateMe(user, body) {
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (!fullName) throw new AppError('Full name is required.');
    if (!Validator.email(email)) throw new AppError('Enter a valid email address.');

    const existing = await this.User.findOne({ email, _id: { $ne: user._id } });
    if (existing) throw new AppError('An account with this email already exists.');

    user.full_name = fullName;
    user.email = email;
    await user.save();
    return auth.publicUser(user);
  }

  async updatePassword(user, body) {
    const current = body.current_password || '';
    const nextPassword = body.new_password || '';
    const confirm = body.confirm_password || '';

    const match = await bcrypt.compare(current, user.password_hash);
    if (!match) throw new AppError('Current password is incorrect.');

    const passwordError = Validator.password(nextPassword);
    if (passwordError) throw new AppError(passwordError);
    if (nextPassword !== confirm) throw new AppError('Passwords do not match.');

    user.password_hash = await bcrypt.hash(nextPassword, 10);
    await user.save();
    return { message: 'Password updated.' };
  }
}

module.exports = UserService;
