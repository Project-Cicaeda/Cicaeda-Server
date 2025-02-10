import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  async signup(signupData: SignupDto){
    //Check if mail already exist 

    //Hash password

    //Save user data in mongodb

  }
}
