const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
// const userService = new UserService();

class UserController {
   async registration(req, res, next) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()));
         }
         console.log('sdfsadfsdf');
         const { email, password } = req.body;

         const userData = await userService.registration(email, password);
         console.log('userData = ', userData);
         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); //30 days
         return res.json(userData);
      } catch (error) {
         console.log(error.message);
         // res.send({ message: error.message });
         next(error);
      }
   }

   async login(req, res, next) {
      try {
         const { email, password } = req.body;
         const userData = await userService.login(email, password);
         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); //30 days
         return res.json(userData);
      } catch (error) {
         next(error);
      }
   }

   async logout(req, res, next) {
      try {
         const { refreshToken } = req.cookies;
         const token = await userService.logout(refreshToken);
         res.clearCookie('refreshToken');
         return res.json(token);
      } catch (error) {
         next(error);
      }
   }

   async activate(req, res, next) {
      try {
         const activationLink = req.params.link;
         await userService.activate(activationLink);
         return res.redirect(process.env.CLIENT_URL);
      } catch (error) {
         console.log(error);
         next(error);
      }
   }

   async refresh(req, res, next) {
      try {
      } catch (error) {
         next(error);
      }
   }

   async getUsers(req, res, next) {
      try {
         res.json(['123', '456']);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = new UserController();
