const router = require('express').Router();
const userController = require('../controllers/cards');
const { validateCard, validateCardId } = require('../middlewares/validation');

router.get('/cards', userController.getAllCards);
router.post('/cards', validateCard, userController.createCard);
router.delete('/cards/:cardId', validateCardId, userController.deleteCard);
router.put('/cards/:cardId/likes', validateCardId, userController.likeCard);
router.delete('/cards/:cardId/likes', validateCardId, userController.dislikeCard);

module.exports = router;
