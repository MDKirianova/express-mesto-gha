const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const BadRequestError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');
const UnauthorizedError = require('../errors/Unauthorized');
const NotFoundError = require('../errors/NotFound');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'secret';

function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Email и пароль обязательные для регистрации'));
  }

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('При регистрации указан email, который уже существует на сервере'));
      } else
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы некорректные данные при регистрации пользователя'));
        } else {
          next(err);
        }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Email и пароль обязательные для авторизации'));
  }
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильный email или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).send({ jwt: token });
    })
    .catch((err) => next(err));
}

function getUsersInfo(req, res, next) {
  return userModel
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
}

function getUserInfo(req, res, next) {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
}

function getCurrentUserInfo(req, res, next) {
  return userModel
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
}

function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
}

function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new NotFoundError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
}

module.exports = {
  getUsersInfo,
  createUser,
  getUserInfo,
  getCurrentUserInfo,
  updateUserProfile,
  updateUserAvatar,
  login,
};
