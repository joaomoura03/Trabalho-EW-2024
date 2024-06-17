const jwt = require('jsonwebtoken');
const User = require('../models/users_Model');

const SECRET_KEY = 'your_secret_key';

module.exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email, password }).exec();
  if (user) {
    user.lastAccessDate = new Date();
    await user.save();
    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, SECRET_KEY, { expiresIn: '1h' });
    return token;
  }
  return null;
};

module.exports.register = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};
