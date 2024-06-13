const User = require('../models/users_Model');

module.exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email: email, password: password }).exec();
  return user;
};

module.exports.register = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};
