const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_Controller');

// Route for the login page
router.get('/', (req, res) => {
  res.render('login');
});

// Route for handling login form submission
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authController.authenticate(email, password);
    if (user) {
      res.redirect('/ucs');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route for the register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Route for handling register form submission
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
        role: 'Aluno',  // Default role, change as needed
        categoria: 'Aluno',  // Default category, change as needed
        filiacao: 'Dep. Informática - Universidade do Minho',  // Default affiliation, change as needed
        webpage: '',
        foto: ''
      };
      await authController.register(userData);
      res.redirect('/');
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(400).send('Passwords do not match');
  }
});

module.exports = router;
