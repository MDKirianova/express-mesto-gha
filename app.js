const express = require('express');
const { default: mongoose } = require('mongoose');
const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards')

mongoose.connect('mongodb://localhost:27017/mestodb').then(() => {
  console.log('mongoDB connected');
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '656ce5314a1ae05871abc9f4' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы по такому URL не найдено' });
});

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
