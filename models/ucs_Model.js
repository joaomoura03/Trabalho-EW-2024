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
  sumario: [String]
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


/*

COMO CRIAR UMA NOVA UC

const UC = require('./ucModel');

// Exemplo de criação de uma nova UC
const novaUC = new UC({
  sigla: "ATP2023",
  titulo: "Algoritmos e Técnicas de Programação",
  docentes: [
    {
      nome: "José Carlos Ramalho",
      foto: "jcr-keep.jpeg",
      categoria: "Professor/Investigador/Empresário",
      filiacao: "Dep. Informática - Universidade do Minho",
      email: "jcr@di.uminho.pt",
      webpage: "http://www.di.uminho.pt/~jcr"
    },
    {
      nome: "Luís Filipe Cunha",
      foto: "lfc-di.jpeg",
      categoria: "Professor Convidado",
      filiacao: "Dep. Informática - Universidade do Minho",
      email: "lfc@di.uminho.pt",
      webpage: ""
    }
  ],
  horario: {
    teoricas: ["quinta das 14h às 16h, sala Ed.1 - 0.04"],
    praticas: [
      "Turno 1: segunda das 14h às 16h, sala Ed. 7 - 1.09",
      "Turno 2: terça das 14h às 16h, sala Ed. 7 - 1.09",
      "Turno 3: terça das 16h às 18h, sala Ed. 7 - 1.09"
    ]
  },
  avaliacao: [
    "8 Trabalhos de casa (20%)",
    "1 Projeto em grupo até 3 elementos (30%)[nota mínima de 10 val.]",
    "1 Teste escrito (40%)[nota mínima de 10 val.]"
  ],
  datas: {
    teste: "7 de Dezembro (17h-20h); salas Ed.2: 0.01 e 0.05",
    exame: "16 de Janeiro (14h-17h); sala Ed.2: 1.15",
    projeto: "primeira semana de Janeiro"
  },
  aulas: [
    {
      tipo: "T",
      data: "2023-09-14",
      sumario: ["Apresentação da disciplina."]
    },
    // Adicione outras aulas conforme necessário...
  ]
});

// Salvando a nova UC no banco de dados
novaUC.save()
  .then(() => console.log('UC criada com sucesso!'))
  .catch(err => console.error('Erro ao criar UC:', err));

*/