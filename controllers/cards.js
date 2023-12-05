const cardModel = require('../models/card');

function getAllCards(req, res) {
  return cardModel
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию. Server error' }));
}

function createCard(req, res) {
  const userId = req.user._id;
  const { name, link } = req.body;
  cardModel
    .create({ name, link, owner: userId })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию. Server error' });
    });
}

function deleteCard(req, res) {
  cardModel
    .findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Карточка по указанному _id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Передан некорректный _id карточки',
        });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию. Server error' });
    });
}

function likeCard(req, res) {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Карточка по указанному _id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message:
            'Переданы некорректные данные для установки лайка на карточке',
        });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию. Server error' });
    });
}

function dislikeCard(req, res) {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Карточка по указанному _id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для снятия лайка с карточки',
        });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию. Server error' });
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
