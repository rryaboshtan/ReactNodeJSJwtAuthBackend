const userService = require('../service/user-service');

// const userService = new UserService();

class UserController {
   async registration(req, res, next) {
      try {
         console.log('sdfsadfsdf');
         const { email, password } = req.body;

         const userData = await userService.registration(email, password);
         console.log('userData = ', userData);
         res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); //30 days
         return res.json(userData);
      } catch (error) {
         console.log(error.message);
         res.send({ message: error.message });
      }
   }

   async login(req, res, next) {
      try {
      } catch (error) {}
   }

   async logout(req, res, next) {
      try {
      } catch (error) {}
   }

   async activate(req, res, next) {
      try {
         const activationLink = req.params.link;
         await userService.activate(activationLink);
         return res.redirect(process.env.CLIENT_URL);
      } catch (error) {
         console.log(error);
      }
   }

   async refresh(req, res, next) {
      try {
      } catch (error) {}
   }

   async getUsers(req, res, next) {
      try {
         res.json(['123', '456']);
      } catch (error) {}
   }
}

module.exports = new UserController();
