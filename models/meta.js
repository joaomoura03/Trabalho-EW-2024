const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docenteSchema = new Schema({
    nome: { type: String, required: true },
    foto: { type: String, required: true },
    categoria: { type: String, required: true },
    filiacao: { type: String, required: true },
    email: { type: String, required: true },
    webpage: { type: String, required: false }
}, { _id: false });

const horarioSchema = new Schema({
    teoricas: [{ type: String, required: true }],
    praticas: [{ type: String, required: true }]
}, { _id: false });

const avaliacaoSchema = new Schema({
    descricao: { type: String, required: true }
}, { _id: false });

const datasSchema = new Schema({
    teste: { type: String, required: true },
    exame: { type: String, required: true },
    projeto: { type: String, required: true }
}, { _id: false });

const sumarioSchema = new Schema({
    tipo: { type: String, required: true },
    data: { type: String, required: true },
    sumario: [{ type: String, required: true }]
}, { _id: false });

const atp2023Schema = new Schema({
    sigla: { type: String, required: true },
    titulo: { type: String, required: true },
    docentes: [docenteSchema],
    horario: horarioSchema,
    avaliacao: [avaliacaoSchema],
    datas: datasSchema,
    aulas: [sumarioSchema]
}, { versionKey: false });

module.exports = mongoose.model('ATP2023', atp2023Schema);