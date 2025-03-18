import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from '../dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ResetToken } from '../schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private mailService: MailService
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

    return { message: "Successfully registered! You can now log in" };
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
      message: " Login successful! ",
      ...tokens, 
      userId: user._id 
    };
  }

  async changePassword(userId, oldPassword: string, newPassword: string) {
    //Find user
    const user = await this.UserModel.findById(userId);
    if(!user){
      throw new NotFoundException('User not found....');
    }

    //Compare old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    //Change password and hash password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;
    await user.save();

    return { message: " Password changed successfully!" };
  }

  async forgotPassword(email: string) {
    //Confirm user exists
    const user = await this.UserModel.findOne({ email });

    if(user){
      //Generate password reset link 
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); //Link is set to expire in 1 hour

      const resetToken = nanoid(64); //Number of characters in token
      await this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate
      });

      //send email with the password reset link (using nodemailer)
      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return { message: 'Password reset link has been sent to your email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    //TODO: Find a valid reset token document 
    //TODO: Change user password and hash it

  }

  async refreshTokens(refreshToken: String) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() }
    });

    if(!token) {
      throw new UnauthorizedException("Refresh Token is invalid or expired");
    }

    return this.generateUserTokens(token.userId);

  }

  async generateUserTokens(userId){
    const accessToken = this.jwtService.sign({userId}, {expiresIn: '15m'} ); //Token will last for 15 minutes(Restart server), use https://www.epochconverter.com/ to confirm times
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

    await this.RefreshTokenModel.updateOne({userId}, {$set: {expiryDate, token}}, {upsert: true});//If token exists expiry date will be updated. If not create new token
  }
}
