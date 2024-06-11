const UC = require('../models/ucs_Model');

module.exports.list = async () => {
  return await UC.find().exec();
}

module.exports.findBySigla = sigla => {
  return UC.findOne({ sigla: sigla }).exec();
}

module.exports.insert = uc => {
  return UC.create(uc);
}

module.exports.removeBySigla = sigla => {
  return UC.deleteOne({ sigla: sigla });
}

module.exports.update = (sigla, uc) => {
  return UC.updateOne({ sigla: sigla }, uc);
}

// Novo método para listar horários de uma UC específica
module.exports.getHorariosBySigla = async (sigla) => {
  const uc = await UC.findOne({ sigla: sigla }).select('horario').exec();
  if (uc) {
    return uc.horario;
  } else {
    throw new Error('UC não encontrada');
  }
}

// Novo método para listar avaliações e datas de uma UC específica
module.exports.getAvaliacoesEDatasBySigla = async (sigla) => {
  const uc = await UC.findOne({ sigla: sigla }).select('avaliacao datas').exec();
  if (uc) {
    return { avaliacao: uc.avaliacao, datas: uc.datas };
  } else {
    throw new Error('UC não encontrada');
  }
}


// Novo método para listar aulas de uma UC específica
module.exports.getAulasBySigla = async (sigla) => {
  const uc = await UC.findOne({ sigla: sigla }).select('aulas').exec();
  if (uc) {
    return uc.aulas;
  } else {
    throw new Error('UC não encontrada');
  }
}

// Método para listar todas as aulas práticas de uma UC específica
module.exports.getPraticasBySigla = async (sigla) => {
  const uc = await UC.findOne({ sigla: sigla }).select('aulas').exec();
  if (uc) {
    return uc.aulas.filter(aula => aula.tipo === 'P');
  } else {
    throw new Error('UC não encontrada');
  }
}

// Método para listar todas as aulas teóricas de uma UC específica
module.exports.getTeoricasBySigla = async (sigla) => {
  const uc = await UC.findOne({ sigla: sigla }).select('aulas').exec();
  if (uc) {
    return uc.aulas.filter(aula => aula.tipo === 'T');
  } else {
    throw new Error('UC não encontrada');
  }
}

// Método para listar todos os docentes de uma UC específica
module.exports.getDocentesBySigla = async (sigla) => {
  const uc = await UC.findOne({ sigla: sigla }).select('docentes').exec();
  if (uc) {
    return uc.docentes;
  } else {
    throw new Error('UC não encontrada');
  }
}