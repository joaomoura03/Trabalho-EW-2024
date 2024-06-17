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

module.exports.addTeorica = async (sigla, novaTeorica) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $push: { 'horario.teoricas': novaTeorica } }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports.addPratica = async (sigla, novaPratica) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $push: { 'horario.praticas': novaPratica } }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports.addAvaliacao = async (sigla, novaAvaliacao) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $push: { avaliacao: novaAvaliacao } }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports.updateDatas = async (sigla, datas) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $set: { datas: datas } }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports.addAulasPratica = async (sigla, aula) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $push: { aulas: aula } }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports.addAulasTeorica = async (sigla, novaTeorica) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $push: { aulas: novaTeorica } }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports.addDocente = async (sigla, newDocente) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $push: { docentes: newDocente } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.removeDocente = async (sigla, email) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $pull: { docentes: { email: email } } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.removeTeoricas = async (sigla, teorica) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $pull: { 'horario.teoricas': teorica } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.removePraticas = async (sigla, pratica) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $pull: { 'horario.praticas': pratica } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.removeAulaPratica = async (sigla, data) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $pull: { aulas: { tipo: 'P', data: data } } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports.removeAulaTeorica = async (sigla, data) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $pull: { aulas: { tipo: 'T', data: data } } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports.removeAvaliacao = async (sigla, avaliacao) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $pull: { avaliacao: avaliacao } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.removeData = async (sigla, tipo) => {
  try {
    const update = {};
    update[`datas.${tipo}`] = "";
    const result = await UC.updateOne(
      { sigla: sigla },
      { $set: update }
    );
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports.updateDatas = async (sigla, datas) => {
  try {
    const result = await UC.updateOne(
      { sigla: sigla },
      { $set: { datas: datas } }
    );
    return result;
  } catch (error) {
    throw error;
  }
};