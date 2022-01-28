const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');

// const mailService = new MailService();
// const tokenService = new TokenService();
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(email, password) {
      try {
         const candidate = await UserModel.findOne({ email });

         if (candidate) {
            throw new Error(`User with email ${email} already exist`);
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
}

module.exports = new UserService();
