const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_Controller');
const checkRole = require('../middlewares/checkRole');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'fileStore'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Listar todos os usuários
router.get('/', checkRole('Admin'), async (req, res) => {
  try {
    const users = await userController.list();
    res.render('admin/usersRole', { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/profile', async (req, res) => {
  try {
    const user = await userController.findUserByIdPerfil(req.user.id);
    if (user) {
      res.render('userProfile', { user, role: req.user.role });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/profile', upload.single('foto'), async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.foto = req.file.filename;
    }
    await userController.updateProfile(req.user.id, updatedData, req.file);
    res.redirect('/users/profile');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para retornar informações específicas de um usuário
router.get('/:id', checkRole('Admin'),async (req, res) => {
  try {
    const user = await userController.findUserByIdPerfil(req.params.id);
    if (user && req.params.id == req.user.id) {
      res.render('userProfile', { user, role: req.user.role  });
    }else if(user) {
      res.render('admin/userEdit', { user, role: req.user.role });
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/:id',  checkRole('Admin'), upload.single('foto'),async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.file) {
      updatedData.foto = req.file.filename;
    }
    await userController.update(req.params.id, updatedData);
    res.redirect('/users/');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Inserir um novo usuário
router.post('/', async (req, res) => {
  try {
    const user = await userController.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Atualizar um usuário pelo ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await userController.update(req.params.id, req.body);
    if (updatedUser.nModified > 0) {
      res.json(updatedUser);
    } else {
      res.status(404).send('Usuário não encontrado ou não atualizado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Remover um usuário pelo ID
router.post('/delete/:id', checkRole('Admin'), async (req, res) => {
  try {
    const result = await userController.removeById(req.params.id);
    if (result.deletedCount > 0) {
      res.redirect('/users/');
    } else {
      res.redirect('/users/:id');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
