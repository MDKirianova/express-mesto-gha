const cardModel = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

function getAllCards(req, res, next) {
  return cardModel
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => next(err));
}

function createCard(req, res, next) {
  const userId = req.user._id;
  const { name, link } = req.body;
  cardModel
    .create({ name, link, owner: userId })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
}

function deleteCard(req, res, next) {
  cardModel
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка по указанному _id не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Нет прав на удаление'));
      }
      return cardModel.findByIdAndDelete(req.params.cardId).then(() => res.send({ message: 'Карточка удалена' })).catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
}

function likeCard(req, res, next) {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка по указанному _id не найдена'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для установки лайка на карточке'));
      }
      return next(err);
    });
}

function dislikeCard(req, res, next) {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка по указанному _id не найдена'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка с карточки'));
      }
      return next(err);
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
