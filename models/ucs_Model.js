const mongoose = require('mongoose');

const docenteSchema = new mongoose.Schema({
  nome: String,
  foto: String,
  categoria: String,
  filiacao: String,
  email: String,
  webpage: String
}, { _id: false });

const horarioSchema = new mongoose.Schema({
  teoricas: [String],
  praticas: [String]
}, { _id: false });

const avaliacaoSchema = new mongoose.Schema({
  tipo: String,
  peso: String
}, { _id: false });

const dataSchema = new mongoose.Schema({
  teste: String,
  exame: String,
  projeto: String
}, { _id: false });

const aulaSchema = new mongoose.Schema({
  tipo: String,
  data: String,
  sumario: [String],
  pdf: String
}, { _id: false });

const ucSchema = new mongoose.Schema({
  sigla: String,
  titulo: String,
  docentes: [docenteSchema],
  horario: horarioSchema,
  avaliacao: [String],
  datas: dataSchema,
  aulas: [aulaSchema]
}, { versionKey: false });

module.exports = mongoose.model('UC', ucSchema);