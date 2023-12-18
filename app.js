const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFound');
const { validateCreateUser, validateLoginUser } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLoginUser, login);

app.use(auth);
app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => next(new NotFoundError('Страницы по такому URL не найдено')));
app.use(errorHandler);

app.listen(PORT);
