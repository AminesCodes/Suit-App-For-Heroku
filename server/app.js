require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const followsRouter = require('./routes/follows');
const commentsRouter = require('./routes/comments');
const reactionsRouter = require('./routes/reactions');
const eventsRouter = require('./routes/events');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/&api&/users', usersRouter);
app.use('/&api&/posts', postsRouter);
app.use('/&api&/follows', followsRouter);
app.use('/&api&/comments', commentsRouter);
app.use('/&api&/reactions', reactionsRouter);
app.use('/&api&/events', eventsRouter);

app.use('/api', (req, res) => { res.send('OK !!!') });
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
