const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const regex = require('../middlewares/validation');
const UnauthorizedError = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: { validator: (url) => regex.test(url) },

  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: { validator: (email) => /.+@.+\..+/.test(email) },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) return user;

            return Promise.reject(new UnauthorizedError('Неправильный email или пароль'));
          });
      }

      return Promise.reject(new UnauthorizedError('Неправильный email или пароль'));
    });
};

module.exports = mongoose.model('user', userSchema);
