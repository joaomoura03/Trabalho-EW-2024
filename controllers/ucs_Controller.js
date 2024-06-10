const UC = require('../models/ucs_Model');

module.exports.list = async () => {
  return await UC.find().exec();
}

module.exports.findBySigla = sigla => {
  return UC.findOne({ sigla: sigla }).exec();
}

module.exports.insert = uc => {
  return UC.create(uc);
}

module.exports.removeBySigla = sigla => {
  return UC.deleteOne({ sigla: sigla });
}

module.exports.update = (sigla, uc) => {
  return UC.updateOne({ sigla: sigla }, uc);
}
