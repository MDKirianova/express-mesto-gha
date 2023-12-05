const router = require('express').Router();
const userController = require('../controllers/cards');

router.get('/cards', userController.getAllCards);
router.post('/cards', userController.createCard);
router.delete('/cards/:cardId', userController.deleteCard);
router.put('/cards/:cardId/likes', userController.likeCard);
router.delete('/cards/:cardId/likes', userController.dislikeCard);

module.exports = router;
