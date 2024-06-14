const express = require('express');
const router = express.Router();
const ucController = require('../controllers/ucs_Controller');

// Listar todas as UCs
router.get('/', async (req, res) => {
  try {
    const ucs = await ucController.list();
    res.render('ucs', { ucs });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Encontrar uma UC pela sigla
router.get('/:sigla', async (req, res) => {
  try {
    const uc = await ucController.findBySigla(req.params.sigla);
    if (uc) {
      res.render('ucDetalhesAluno', { uc });
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

// Nova rota para listar os horários de uma UC específica
router.get('/:sigla/horarios', async (req, res) => {
  try {
    const horarios = await ucController.getHorariosBySigla(req.params.sigla);
    res.json(horarios);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Rota para listar avaliações e datas de uma UC específica
router.get('/:sigla/avaliacoes-e-datas', async (req, res) => {
  try {
    const uc = await ucController.findBySigla(req.params.sigla);
    if (uc) {
      res.render('ucAvaliacoesDatas', { uc });
    } else {
      res.status(404).send('UC não encontrada');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Rota para listar docentes de uma UC específica
router.get('/:sigla/docentes', async (req, res) => {
  try {
    const docentes = await ucController.getDocentesBySigla(req.params.sigla);
    res.render('ucDocentes', { sigla: req.params.sigla, docentes });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Nova rota para listar aulas de uma UC específica
router.get('/:sigla/aulas', async (req, res) => {
  try {
    const aulas = await ucController.getAulasBySigla(req.params.sigla);
    res.json(aulas);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para listar avaliações e datas de uma UC específica
router.get('/:sigla/avaliacoes-e-datas', async (req, res) => {
  try {
    const uc = await ucController.findBySigla(req.params.sigla);
    res.render('ucAvaliacoesDatas', { uc });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para listar aulas práticas de uma UC específica
router.get('/:sigla/aulas/praticas', async (req, res) => {
  try {
    const praticas = await ucController.getPraticasBySigla(req.params.sigla);
    res.render('ucPraticas', { sigla: req.params.sigla, praticas });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para listar aulas teóricas de uma UC específica
router.get('/:sigla/aulas/teoricas', async (req, res) => {
  try {
    const teoricas = await ucController.getTeoricasBySigla(req.params.sigla);
    res.render('ucTeoricas', { sigla: req.params.sigla, teoricas });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Adicionar nova aula
router.post('/:sigla', async (req, res) => {
  const { type, class: newClass } = req.body;
  try {
    if (type === 'teoricas') {
      const result = await ucController.addTeorica(req.params.sigla, newClass);
      res.redirect(`/ucs/${req.params.sigla}`);
    } else if (type === 'praticas') {
      const result = await ucController.addPratica(req.params.sigla, newClass);
      res.redirect(`/ucs/${req.params.sigla}`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router;
