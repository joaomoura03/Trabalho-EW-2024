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


/*
COMO CRIAR UM NOVO USUÁRIO

const User = require('./userModel');

// Exemplo de criação de um novo usuário
const novoUsuario = new User({
  _id: "1",
  nome: "Daniel Henrique Cracel Rodrigues",
  foto: "foto_Daniel.jpeg",
  categoria: "Aluno",
  filiacao: "Dep. Informática - Universidade do Minho",
  email: "100661@alunos.uminho.pt",
  webpage: "https://github.com/Rcracel09",
  role: "Aluno",
  password: "1234",
  registrationDate: new Date("2024-06-08T15:00:00Z"),
  lastAccessDate: new Date("2024-06-09T10:00:00Z")
});

// Salvando o novo usuário no banco de dados
novoUsuario.save()
  .then(() => console.log('Usuário criado com sucesso!'))
  .catch(err => console.error('Erro ao criar usuário:', err));

*/ 