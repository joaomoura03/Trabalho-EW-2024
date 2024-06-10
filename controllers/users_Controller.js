const User = require('../models/users_Model');

module.exports.list = async () => {
  return await User.find().exec();
}

module.exports.findById = id => {
  return User.findOne({ _id: id }).exec();
}

module.exports.findByEmail = email => {
  return User.findOne({ email: email }).exec();
}

module.exports.insert = user => {
  return User.create(user);
}

module.exports.removeById = id => {
  return User.deleteOne({ _id: id });
}

module.exports.update = (id, user) => {
  return User.updateOne({ _id: id }, user);
}
