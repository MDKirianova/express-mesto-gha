const userModel = require("../models/user");

function getUsersInfo(req, res) {
  return userModel
    .find({})
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(() => {
      return res
        .status(500)
        .send({ message: "Ошибка по умолчанию. Server error" });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  return userModel
    .create({ name, about, avatar })
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные" });
      } else {
        return res
          .status(500)
          .send({ message: "Ошибка по умолчанию. Server error" });
      }
    });
}

function getUserInfo(req, res) {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректный _id пользователя " });
      }
      return res
        .status(500)
        .send({ message: "Ошибка по умолчанию. Server error" });
    });
}

function updateUserProfile(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res
        .status(500)
        .send({ message: "Ошибка по умолчанию. Server error" });
    });
}

function updateUserAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;
  return userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      return res.status(200).send(user);
    })
    .catch((err)=>{
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      }
      return res
        .status(500)
        .send({ message: "Ошибка по умолчанию. Server error" });
    });
}

module.exports = {
  getUsersInfo,
  createUser,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
};
