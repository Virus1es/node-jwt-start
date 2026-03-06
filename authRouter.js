const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware');

router.post('/registration', [
    check('username', 'Username can\'t be empty').trim().notEmpty(),
    check('password', 'Password length must be in range 4 and 10').trim().isLength({min: 4, max: 10})
], controller.registration);
router.post('/login', controller.login);
router.get('/users', authMiddleware, controller.getUsers);

module.exports = router;