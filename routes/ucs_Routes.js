const express = require('express');
const router = express.Router();
const ucController = require('../controllers/ucs_Controller');

// Listar todas as UCs
router.get('/', async (req, res) => {
  try {
    const ucs = await ucController.list();
    res.json(ucs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Encontrar uma UC pela sigla
router.get('/:sigla', async (req, res) => {
  try {
    const uc = await ucController.findBySigla(req.params.sigla);
    if (uc) {
      res.json(uc);
    } else {
      res.status(404).send('UC não encontrada');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Inserir uma nova UC
router.post('/', async (req, res) => {
  try {
    const uc = await ucController.insert(req.body);
    res.status(201).json(uc);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Atualizar uma UC pela sigla
router.put('/:sigla', async (req, res) => {
  try {
    const updatedUC = await ucController.update(req.params.sigla, req.body);
    if (updatedUC.nModified > 0) {
      res.json(updatedUC);
    } else {
      res.status(404).send('UC não encontrada ou não atualizada');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Remover uma UC pela sigla
router.delete('/:sigla', async (req, res) => {
  try {
    const result = await ucController.removeBySigla(req.params.sigla);
    if (result.deletedCount > 0) {
      res.send('UC removida com sucesso');
    } else {
      res.status(404).send('UC não encontrada');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
