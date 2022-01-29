const Router = require('express').Router;
const { body } = require('express-validator');

const userController = require('../controllers/user-controller');
// const User = require('../models/User');
// const config = require('config');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { check, validationResult } = require('express-validator');

// const userController = new UserController();
const router = new Router();
router.post(
   '/registration',
   body('email').isEmail(),
   body('password').isLength({ min: 3, max: 32 }),
   userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);

module.exports = router;
