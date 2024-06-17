const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_Controller');
const mongoose = require('mongoose');

// Rota para a página de login
router.get('/', (req, res) => {
  res.render('login');
});

// Rota para o formulário de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authController.authenticate(email, password);
    if (token) {
      res.cookie('token', token);
      res.redirect('/ucs');
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para a página de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Rota para o formulário de registro
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    try {
      const userData = {
        _id: new mongoose.Types.ObjectId().toString(),
        nome: username,
        email: email,
        password: password,
        registrationDate: new Date(),
        lastAccessDate: new Date(),
        role: 'Aluno',
        categoria: 'Aluno',
        filiacao: 'Universidade do Minho',
        webpage: '',
        foto: ''
      };
      await authController.register(userData);
      res.redirect('/');
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(400).send('As senhas não coincidem');
  }
});

module.exports = router;
