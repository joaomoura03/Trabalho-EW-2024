const jwt = require('jsonwebtoken');

const secret = 'your_secret_key'; // Substitua pela sua chave secreta

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Extrai o token dos cookies da requisição

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = authMiddleware;
