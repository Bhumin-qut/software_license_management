const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../errors/AppError');
const Validator = require('../utils/Validator');
const auth = require('../middleware/auth');

class AuthService {
  constructor(userModel = User) {
    this.userModel = userModel;
  }

  async register(body) {
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = body.password || '';
    const confirm = body.confirm_password || '';

    if (!fullName) throw new AppError('Full name is required.');
    if (!Validator.email(email)) throw new AppError('Enter a valid email address.');
    const passwordError = Validator.password(password);
    if (passwordError) throw new AppError(passwordError);
    if (password !== confirm) throw new AppError('Passwords do not match.');

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new AppError('An account with this email already exists.');

    const user = await this.userModel.create({
      full_name: fullName,
      email,
      password_hash: await bcrypt.hash(password, 10),
      role: 'user',
      status: 'active',
    });

    return { token: auth.signToken(user), user: auth.publicUser(user) };
  }

  async login(body) {
    const email = String(body.email || '').trim().toLowerCase();
    const password = body.password || '';
    if (!email || !password) throw new AppError('Email and password are required.');

    const user = await this.userModel.findOne({ email });
    if (!user) throw new AppError('Incorrect email or password.', 401);
    if (user.status === 'blocked') throw new AppError('This account is blocked.', 403);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new AppError('Incorrect email or password.', 401);

    return { token: auth.signToken(user), user: auth.publicUser(user) };
  }

  async forgotPassword(body) {
    const email = String(body.email || '').trim().toLowerCase();
    const newPassword = body.new_password || '';
    const confirm = body.confirm_password || '';

    if (!Validator.email(email)) throw new AppError('Enter a valid email address.');

    const user = await this.userModel.findOne({ email });
    if (!user) throw new AppError('No account found with that email.', 404);
    if (user.status === 'blocked') throw new AppError('This account is blocked.', 403);

    if (!newPassword) return { exists: true, message: 'Account found. Choose a new password.' };

    const passwordError = Validator.password(newPassword);
    if (passwordError) throw new AppError(passwordError);
    if (newPassword !== confirm) throw new AppError('Passwords do not match.');

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return { message: 'Password updated. You can sign in.' };
  }
}

module.exports = AuthService;
