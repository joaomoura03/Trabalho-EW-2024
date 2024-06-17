const express = require('express');
const router = express.Router();
const ucController = require('../controllers/ucs_Controller');
const userController = require('../controllers/users_Controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'fileStore'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Listar todas as UCs
router.get('/', async (req, res) => {
  try {
    const ucs = await ucController.list();
    res.render('ucs', { ucs, role: req.user.role });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Encontrar uma UC pela sigla
router.get('/:sigla', async (req, res) => {
  try {
    const uc = await ucController.findBySigla(req.params.sigla);
    const userId = req.user.id;
    const ucSigla = req.params.sigla;

    const isDocente = await isUserDocenteInUC(userId, ucSigla);
    if (uc) {
      if (req.user.role === 'Aluno') {
        res.render('aluno/ucDetalhesAluno', { uc, role: req.user.role });
      } else if ((isDocente && req.user.role === 'Docente') || req.user.role === 'Admin') {
        res.render('professor/ucDetalhesProf', { uc, role: req.user.role });
      } else if (req.user.role === 'Docente') {
        res.render('aluno/ucDetalhesAluno', { uc, role: req.user.role });
      } else {
        res.status(403).send('Access denied. You do not have the required role.');
      }
    } else {
      res.status(404).send('UC não encontrada');
    }
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
router.post('/:sigla/remover', async (req, res) => {
  try {
    const result = await ucController.removeBySigla(req.params.sigla);
    if (result.deletedCount > 0) {
      res.redirect('/ucs');
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
    const userId = req.user.id;
    const ucSigla = req.params.sigla;

    const isDocente = await isUserDocenteInUC(userId, ucSigla);
    if (uc) {
      if (req.user.role === 'Aluno') {
        res.render('aluno/ucAvaliacoesDatas', { uc, role: req.user.role });
      } else if ((isDocente && req.user.role === 'Docente') || req.user.role === 'Admin') {
        res.render('professor/ucAvaliacoesDatasProf', { uc, role: req.user.role });
      } else if (req.user.role === 'Docente') {
        res.render('aluno/ucAvaliacoesDatas', { uc, role: req.user.role });
      } else {
        res.status(403).send('Access denied. You do not have the required role.');
      }
      
    } else {
      res.status(404).send('UC não encontrada');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const isUserDocenteInUC = async (userId, ucSigla) => {
  const user = await userController.findUserByIdPerfil(userId);
  const uc = await ucController.findBySigla(ucSigla);
  return uc.docentes.some(docente => docente.email === user.email);
};

// Rota para listar docentes de uma UC específica
router.get('/:sigla/docentes', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains the logged-in user info
    const ucSigla = req.params.sigla;

    const isDocente = await isUserDocenteInUC(userId, ucSigla);
    if (req.user.role === 'Aluno') {
      const docentes = await ucController.getDocentesBySigla(req.params.sigla);
      res.render('aluno/ucDocentes', { sigla: req.params.sigla, docentes , role: req.user.role});
    } else if ((isDocente && req.user.role === 'Docente') || req.user.role === 'Admin') {
      const docentes = await ucController.getDocentesBySigla(req.params.sigla);
      res.render('professor/ucDocentesProf', { sigla: req.params.sigla, docentes, role: req.user.role });
    } else if(req.user.role === 'Docente') {
        const docentes = await ucController.getDocentesBySigla(req.params.sigla);
        res.render('aluno/ucDocentes', { sigla: req.params.sigla, docentes, role: req.user.role });
    } else {
      res.status(403).send('Access denied. You do not have the required role.');
    }
    
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


// Rota para listar aulas práticas de uma UC específica
router.get('/:sigla/aulas/praticas', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains the logged-in user info
    const ucSigla = req.params.sigla;

    const isDocente = await isUserDocenteInUC(userId, ucSigla);
    if (req.user.role === 'Aluno') {
      const praticas = await ucController.getPraticasBySigla(req.params.sigla);
      res.render('aluno/ucPraticas', { sigla: req.params.sigla, praticas, role: req.user.role });
    } else if ((isDocente && req.user.role === 'Docente') || req.user.role === 'Admin') {
      const praticas = await ucController.getPraticasBySigla(req.params.sigla);
      res.render('professor/ucPraticasProf', { sigla: req.params.sigla, praticas, role: req.user.role });
    }else if (req.user.role === 'Docente') {
      const praticas = await ucController.getPraticasBySigla(req.params.sigla);
      res.render('aluno/ucPraticas', { sigla: req.params.sigla, praticas, role: req.user.role });
    } else {
      res.status(403).send('Access denied. You do not have the required role.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rota para listar aulas teóricas de uma UC específica
router.get('/:sigla/aulas/teoricas', async (req, res) => {
  try {
    const userId = req.user.id;
    const ucSigla = req.params.sigla;

    const isDocente = await isUserDocenteInUC(userId, ucSigla);
    if (req.user.role === 'Aluno') {
      const teoricas = await ucController.getTeoricasBySigla(req.params.sigla);
      res.render('aluno/ucTeoricas', { sigla: req.params.sigla, teoricas, role: req.user.role });
    } else if ((isDocente && req.user.role === 'Docente') || req.user.role === 'Admin') {
      const teoricas = await ucController.getTeoricasBySigla(req.params.sigla);
      res.render('professor/ucTeoricasProf', { sigla: req.params.sigla, teoricas, role: req.user.role });
    }else if (req.user.role === 'Docente') {
      const teoricas = await ucController.getTeoricasBySigla(req.params.sigla);
      res.render('aluno/ucTeoricas', { sigla: req.params.sigla, teoricas, role: req.user.role });
    } else {
      res.status(403).send('Access denied. You do not have the required role.');
    }
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

// Adicionar nova avaliação
router.post('/:sigla/avaliacoes-e-datas', async (req, res) => {
  const { type, class: novaAvaliacao } = req.body;
  try {
    if (type === 'avaliacao') {
      const result = await ucController.addAvaliacao(req.params.sigla, novaAvaliacao);
      res.redirect(`/ucs/${req.params.sigla}/avaliacoes-e-datas`);
    } else if (type === 'datas') {
      const result = await ucController.updateDatas(req.params.sigla, { teste, exame, projeto });
      res.redirect(`/ucs/${req.params.sigla}/avaliacoes-e-datas`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Adicionar nova aula prática
router.post('/:sigla/aulas/praticas', upload.single('pdf'), async (req, res) => {
  const { data, sumario } = req.body;
  const aula = { tipo: 'P', data, sumario: sumario.split('\n') };
  if (req.file) {
    aula.pdf = req.file.filename;
  }
  try {
    const result = await ucController.addAulasPratica(req.params.sigla, aula);
    res.redirect(`/ucs/${req.params.sigla}/aulas/praticas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post('/:sigla/aulas/teoricas', upload.single('pdf'), async (req, res) => {
  const { data, sumario } = req.body;
  const aula = { tipo: 'T', data, sumario: sumario.split('\n') };

  if (req.file) {
    aula.pdf = req.file.filename;
  }

  try {
    const result = await ucController.addAulasTeorica(req.params.sigla, aula);
    res.redirect(`/ucs/${req.params.sigla}/aulas/teoricas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.post('/', async (req, res) => {
  const { sigla, titulo } = req.body;

  try {
    // Busque os detalhes completos do usuário logado
    const loggedInUser = await userController.findUserByIdPerfil(req.user.id);

    const loggedInDocente = {
      nome: loggedInUser.nome,
      foto: loggedInUser.foto || "",  // Padrão para string vazia se não houver foto
      categoria: loggedInUser.categoria || "",  // Padrão para string vazia se não houver categoria
      filiacao: loggedInUser.filiacao || "",  // Padrão para string vazia se não houver filiação
      email: loggedInUser.email,
      webpage: loggedInUser.webpage || ""  // Padrão para string vazia se não houver webpage
    };

    const newUC = {
      sigla,
      titulo,
      docentes: [loggedInDocente],
      horario: { teoricas: [], praticas: [] },
      avaliacao: [],
      datas: { teste: "", exame: "", projeto: "" },
      aulas: []
    };

    const uc = await ucController.insert(newUC);
    res.redirect('/ucs');
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Adicionar novo docente a uma UC
router.post('/:sigla/docentes', async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch user details by email
    const user = await userController.findByEmail(email);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const newDocente = {
      nome: user.nome,
      foto: user.foto || "",  // Default to an empty string if no photo is provided
      categoria: user.categoria || "",  // Default to an empty string if no category is provided
      filiacao: user.filiacao || "",  // Default to an empty string if no affiliation is provided
      email: user.email,
      webpage: user.webpage || ""  // Default to an empty string if no webpage is provided
    };

    const result = await ucController.addDocente(req.params.sigla, newDocente);
    res.redirect(`/ucs/${req.params.sigla}/docentes`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a docente from a UC
router.post('/:sigla/docentes/remover', async (req, res) => {
  const { email } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removeDocente(sigla, email);
    res.redirect(`/ucs/${sigla}/docentes`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a horário teórico
router.post('/:sigla/removeT', async (req, res) => {
  const { teorica } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removeTeoricas(sigla, teorica);
    res.redirect(`/ucs/${sigla}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a horário prático
router.post('/:sigla/removeP', async (req, res) => {
  const { pratica } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removePraticas(sigla, pratica);
    res.redirect(`/ucs/${sigla}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a aula prática
router.post('/:sigla/aulas/praticas/remover', async (req, res) => {
  const { data } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removeAulaPratica(sigla, data);
    res.redirect(`/ucs/${sigla}/aulas/praticas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a aula teórica
router.post('/:sigla/aulas/teoricas/remover', async (req, res) => {
  const { data } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removeAulaTeorica(sigla, data);
    res.redirect(`/ucs/${sigla}/aulas/teoricas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove an avaliação
router.post('/:sigla/avaliacoes/remover', async (req, res) => {
  const { avaliacao } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removeAvaliacao(sigla, avaliacao);
    res.redirect(`/ucs/${sigla}/avaliacoes-e-datas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a data
router.post('/:sigla/datas/remover', async (req, res) => {
  const { tipo } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.removeData(sigla, tipo);
    res.redirect(`/ucs/${sigla}/avaliacoes-e-datas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Route to update datas
router.post('/:sigla/datas', async (req, res) => {
  const { teste, exame, projeto } = req.body;
  const sigla = req.params.sigla;

  try {
    await ucController.updateDatas(sigla, { teste, exame, projeto });
    res.redirect(`/ucs/${sigla}/avaliacoes-e-datas`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
