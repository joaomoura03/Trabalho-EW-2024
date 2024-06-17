var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth_Routes');
var ucsRouter = require('./routes/ucs_Routes');
var usersRouter = require('./routes/users_Routes');
var authMiddleware = require('./middlewares/auth_verify');
var clearToken = require('./middlewares/clear_token');

var app = express();

var mongoose = require("mongoose");

var mongoDB = "mongodb://127.0.0.1/UCS";
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
db.once("open", () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ucs', authMiddleware, ucsRouter);
app.use('/users', authMiddleware, usersRouter);
app.use('/', clearToken, authRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
