const clearToken = (req, res, next) => {
    res.clearCookie('token');
    next();
  };
  
  module.exports = clearToken;
  