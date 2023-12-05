const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/users', userController.getUsersInfo);
router.post('/users', userController.createUser);
router.patch('/users/me', userController.updateUserProfile);
router.patch('/users/me/avatar', userController.updateUserAvatar);
router.get('/users/:userId', userController.getUserInfo);

module.exports = router;
