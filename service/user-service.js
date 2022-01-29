const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
   async registration(email, password) {
      try {
         const candidate = await UserModel.findOne({ email });

         if (candidate) {
            // throw new Error(`User with email ${email} already exist`);
            throw ApiError.BadRequest(`User with email ${email} already exist`);
         }

         const hashPassword = await bcrypt.hash(password, 8);
         console.log('In User Service registration');
         const activationLink = uuid.v4();
         const user = await UserModel.create({ email, password: hashPassword, activationLink });
         mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
         //  mailService.sendActivationMail(email, activationLink);

         console.log('In User Service registration');
         const userDto = new UserDto(user); //id, email, isActivated
         const tokens = tokenService.generateTokens({ ...userDto });

         await tokenService.saveToken(userDto.id, tokens.refreshToken);

         return {
            ...tokens,
            user: userDto,
         };
      } catch (error) {
         console.log(error);
         // res.send({ message: 'Server error' });
      }
   }
   async activate(activationLink) {
      const user = await UserModel.findOne({ activationLink });
      if (!user) {
         throw ApiError.BadRequest(`Incorrect activation link: ${activationLink}`);
      }
      user.isActivated = true;
      await user.save();
   }

   async login(email, password) {
      const user = await UserModel.findOne({ email });
      if (!user) {
         throw ApiError.BadRequest(`User with such email not found`);
      }
      const isPasswordEquals = await bcrypt.compare(password, user.password);
      if (!isPasswordEquals) {
         throw ApiError.BadRequest(`Incorrect password`);
      }

      const userDto = new UserDto(user);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
         ...tokens,
         user: userDto,
      };
   }
}

module.exports = new UserService();
