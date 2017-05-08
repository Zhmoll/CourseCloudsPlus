const express = require('express');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const router = require('./router');
const wechat = require('./wechat');
const config = require('config-lite').session;

const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cors({ credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: config.secret,
  name: config.name,
  resave: config.resave,
  saveUninitialized: config.saveUninitialized,
  cookie: config.cookie,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

router(app);
app.use('/wechat', wechat);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  if (err.code && err.message)
    console.log(err.code, err.message);
  else
    console.log(err);
  res.json({ code: err.code, message: err.message });
});

module.exports = app;
