import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup') //auth/signup
  async signUp(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  @Post('login') //auth/login
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('refresh') //auth/refresh
  async refreshTokens(@Body() refreshTokenDTO: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDTO.refreshToken);
  }
}
// TODO:Refreshing tokens