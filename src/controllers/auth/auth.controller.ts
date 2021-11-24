import { BadRequestException, Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import { Response } from 'express';
import { AuthGuard, UserId } from 'src/utils/auth.guard';
import { config } from '../../config';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { Validate } from '../../utils/validator.pipe';
import { IChangePassword, IConfirmResetPassword, ILogin, IResetPassword, ISignup, IVerifyEmail } from './auth.model';
import { changePasswordSchema, confirmResetPasswordSchema, resetPasswordSchema, signupSchema, verifyEmailSchema } from './auth.schema';

@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
  ) { }

  @Post('signup')
  @HttpCode(200)
  @Validate(signupSchema)
  async register(@Body() body: ISignup) {
    const user = await this.authService.register(body);
    this.emailService.sendVerificationCode(user);
  }

  @Post('login')
  @HttpCode(200)
  @Validate(signupSchema)
  async login(@Body() body: ILogin, @Res() res: Response) {
    const userId = await this.authService.login(body);
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: config.jwt.refreshTokenExpiration });
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: config.jwt.accessTokenExpiration });
    res.cookie('authentication', refreshToken, { httpOnly: true, expires: addDays(new Date(), 7) });
    return res.send({ userId, refreshToken, accessToken });
  }
  
  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.clearCookie('authentication');
    return res.send();
  }

  @Post('verify_email')
  @HttpCode(200)
  @Validate(verifyEmailSchema)
  async verifyEmail(@Body() body: IVerifyEmail) {
    await this.authService.verify(body.email, body.token);
  }

  @Post('resend_confirmation_email')
  @HttpCode(200)
  @Validate(resetPasswordSchema)
  async resendConfirmationEmail(@Body() body: IResetPassword) {
    const user = await User.findOne({ email: body.email }, { select: ['id', 'activated', 'email'] });
    if (user?.activated == true) throw new BadRequestException('ALREADY_ACTIVATED');
    if (user) this.emailService.sendVerificationCode(user);
  }

  @Post('reset_password')
  @HttpCode(200)
  @Validate(resetPasswordSchema)
  async resetPassword(@Body() body: IResetPassword) {
    const user = await User.findOne({ email: body.email }, { select: ['id', 'email'] });
    if (user) this.emailService.sendRecoveryCode(user);
  }

  @Post('confirm_reset_password')
  @HttpCode(200)
  @Validate(confirmResetPasswordSchema)
  async confirmResetPassword(@Body() body: IConfirmResetPassword) {
    await this.authService.confirmResetPassword(body.email, body.token, body.newPassword);
  }

  @Get('refresh_token')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async refreshToken(@UserId() userId: string, @Res() res: Response) {
    const refreshToken = this.jwtService.sign({ userId: userId }, { expiresIn: config.jwt.refreshTokenExpiration });
    const accessToken = this.jwtService.sign({ userId: userId }, { expiresIn: config.jwt.accessTokenExpiration });
    res.cookie('authentication', refreshToken, { httpOnly: true, expires: addDays(new Date(), 7) });
    return res.send({ refreshToken, accessToken });
  }

  @Get('change_password')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Validate(changePasswordSchema)
  async changePassword(@UserId() userId: string, @Body() body: IChangePassword) {
    await this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword
    );
  }
}
