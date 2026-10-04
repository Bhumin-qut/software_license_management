const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthMiddleware {
  constructor(userModel = User) {
    this.userModel = userModel;
  }

  secret() {
    return process.env.JWT_SECRET || 'sl_assessment_dev_secret';
  }

  signToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, this.secret(), {
      expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
  }

  publicUser(user) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password_hash;
    return obj;
  }

  protect = async (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Please sign in.' });

      const decoded = jwt.verify(token, this.secret());
      const user = await this.userModel.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'Please sign in.' });
      if (user.status === 'blocked') return res.status(403).json({ message: 'This account is blocked.' });

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Please sign in.' });
    }
  };

  admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    return next();
  };
}

module.exports = new AuthMiddleware();
