import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private Usermodel: Model<User>){}

  async signup(signupData: SignupDto){
    const { name, email, password} = signupData  

    //Check if mail already exist 
    const emailInUse = await this.Usermodel.findOne({
      email
    });
    if (emailInUse) {
      throw new BadRequestException ('Email is already in use');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10); //Increase salt rounds for ↑security but ↓performance

    //Save user data in mongodb
    await this.Usermodel.create({
      name,
      email,
      password: hashedPassword
    })
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    //Check if user exists
    const user = await this.Usermodel.findOne({ email }); 
    if (!user) {
      throw new UnauthorizedException("Wrong credentials");
    }

    //Authenticate via password 
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      throw new UnauthorizedException("Wrong credentials");
    }

    
    return{
      message: "success"
    }

  }
}
