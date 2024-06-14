const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: String,
  nome: String,
  foto: String,
  categoria: String,
  filiacao: String,
  email: String,
  webpage: String,
  role: String,
  password: String,
  registrationDate: Date,
  lastAccessDate: Date,
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);