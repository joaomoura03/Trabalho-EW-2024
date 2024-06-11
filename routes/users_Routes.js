const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_Controller');

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const users = await userController.list();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para retornar informações específicas de um usuário
router.get('/:id', async (req, res) => {
  try {
    const user = await userController.findUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Usuário não encontrado');
    }
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
router.delete('/:id', async (req, res) => {
  try {
    const result = await userController.removeById(req.params.id);
    if (result.deletedCount > 0) {
      res.send('Usuário removido com sucesso');
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
