const router = require('express').Router();
const userController = require('../controllers/users');
const { validateUserInfo, validateCardId, validateUserAvatar } = require('../middlewares/validation');

router.get('/users', userController.getUsersInfo);
router.get('/users/me', userController.getCurrentUserInfo);
router.patch('/users/me', validateUserInfo, userController.updateUserProfile);
router.patch('/users/me/avatar', validateUserAvatar, userController.updateUserAvatar);
router.get('/users/:userId', validateCardId, userController.getUserInfo);

module.exports = router;
