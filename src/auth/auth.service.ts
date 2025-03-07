import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService
  ){}

  async signup(signupData: SignupDto){
    const { name, email, password} = signupData  

    //Check if mail already exist 
    const emailInUse = await this.UserModel.findOne({
      email
    });
    if (emailInUse) {
      throw new BadRequestException ('Email is already in use');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10); //Increase salt rounds for ↑security but ↓performance

    //Save user data in mongodb
    await this.UserModel.create({
      name,
      email,
      password: hashedPassword
    })
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    //Check if user exists
    const user = await this.UserModel.findOne({ email }); 
    if (!user) {
      throw new UnauthorizedException("Wrong credentials");
    }

    //Authenticate via password 
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      throw new UnauthorizedException("Wrong credentials");
    }

    //Generate JWT token
    const tokens = await this.generateUserTokens(user._id);
    return {
      ...tokens, 
      userId: user._id 
    };
  }

  async refreshTokens(refreshToken: String) {
    const token = await this.RefreshTokenModel.findOneAndDelete({ //Deletes the token after use
      token: refreshToken,
      expiryDate: { $gte: new Date() }
    });

    if(!token) {
      throw new UnauthorizedException("Refresh Token is invalid or expired");
    }

    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId){
    const accessToken = this.jwtService.sign({userId}, {expiresIn: 100} ); //Token will last for 15 minutes(Restart server), use https://www.epochconverter.com/ to confirm times
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken
    }
  }

  async storeRefreshToken(token: String, userId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); //Refresh token will expire after 3 days from creation 

    await this.RefreshTokenModel.create({token, userId, expiryDate });
  }
}
