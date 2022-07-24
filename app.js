const express = require('express');
const mongoose = require('mongoose');
const bp = require('body-parser');

const authRouter = require('./routers/authRouter');
const usersRouter = require('./routers/usersRouter');
const booksRouter = require('./routers/booksRouter');
const weatherRouter = require('./routers/weatherRouter');
const tokenRouter = require('./routers/tokenRouter')


const PORT = process.env.PORT || 3000;

const app = express();
app.use(bp.json());
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/book', booksRouter);
app.use('/token', tokenRouter);
app.use('/', weatherRouter)
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.get('/user', function (request, response) {
  response.sendFile(__dirname + '/views/users.html');
});
app.get('/book', function (request, response) {
  response.sendFile(__dirname + '/views/books.html');
});
app.get('/registration', function (request, response) {
  response.sendFile(__dirname + '/views/registration.html');
});
app.get('/login', function (request, response) {
  response.sendFile(__dirname + '/views/login.html');
});
app.get('/change', function (request, response) {
  response.sendFile(__dirname + '/views/change.html');
});

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://Karomol:Egs0NsVumjY4y65t@cluster0.2kalmva.mongodb.net/auth?retryWrites=true&w=majority'
    );
    app.listen(PORT, function () {
      console.log('Connection..');
    });
  } catch (e) {
    console.log(e);
  }
};

start();
