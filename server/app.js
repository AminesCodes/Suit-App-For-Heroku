require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var session = require('express-session');
var passport = require('./auth/passport')

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const followsRouter = require('./routes/follows');
const commentsRouter = require('./routes/comments');
const reactionsRouter = require('./routes/reactions');
const eventsRouter = require('./routes/events');

const { checkUserLogged } = require('./auth/helpers');

const app = express();

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "NOT_A_GOOD_SECRET",
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/&api&/users', usersRouter);
app.use('/&api&/posts', checkUserLogged, postsRouter);
app.use('/&api&/follows', checkUserLogged, followsRouter);
app.use('/&api&/comments', checkUserLogged, commentsRouter);
app.use('/&api&/reactions', checkUserLogged, reactionsRouter);
app.use('/&api&/events', checkUserLogged, eventsRouter);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
