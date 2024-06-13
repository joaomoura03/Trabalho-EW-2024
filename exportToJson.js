const fs = require('fs');
const mongoose = require('mongoose');
const UC = require('./models/ucs_Model');
const User = require('./models/users_Model');

const mongoDB = "mongodb://127.0.0.1/UCS";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
db.once("open", async () => {
  console.log("Conexão ao MongoDB realizada com sucesso");

  try {
    const ucs = await UC.find().exec();
    const users = await User.find().exec();

    fs.writeFileSync('datasets/ucs.json', JSON.stringify(ucs, null, 2));
    fs.writeFileSync('datasets/users.json', JSON.stringify(users, null, 2));

    console.log('Dados exportados com sucesso para datasets/ucs.json e datasets/users.json');
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
  } finally {
    mongoose.connection.close();
  }
});

// Como correr isto:
// node exportToJson.js

