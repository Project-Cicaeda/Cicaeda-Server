import { Controller, Post, Body, Put, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-tokens.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto,OTPVerificationDto } from '../dtos/reset-password.dto';

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

  @UseGuards(AuthGuard)
  @Put('change-password') //auth/change-password
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
    return this.authService.changePassword(req.userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
  }

  @Post('forgot-password') //auth/forgot-password
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-otp') // auth/verify-otp
  async verifyOTP(@Body() otpVerificationDto: OTPVerificationDto) {
    return this.authService.verifyOTP(otpVerificationDto);
  }

  @Put('reset-password') // auth/reset-password
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
