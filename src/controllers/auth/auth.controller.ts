import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import { Response } from 'express';
import { AuthGuard, UserId } from 'src/utils/auth.guard';
import { config } from '../../config';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { Validate } from '../../utils/validator.pipe';
import { IChangePassword, IResetPassword, ILogin, IRecover, ISignup, IVerify } from './auth.model';
import { changePasswordSchema, resetPasswordSchema, recoverSchema, signupSchema, verifySchema, loginSchema } from './auth.schema';

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
  @Validate(loginSchema)
  async login(@Body() body: ILogin, @Res() res: Response) {
    const userId = await this.authService.login(body);
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: config.jwt.refreshTokenExpiration });
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: config.jwt.accessTokenExpiration });
    const expiresIn = config.jwt.accessTokenExpiration * 1_000;
    const refreshTokenExpiresIn = config.jwt.refreshTokenExpiration * 1_000;
    res.cookie('authentication', refreshToken, { httpOnly: true, expires: addDays(new Date(), 7) });
    return res.send({ refreshToken, accessToken, expiresIn, refreshTokenExpiresIn });
  }
  
  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.clearCookie('authentication');
    return res.send();
  }

  @Post('verify')
  @HttpCode(200)
  @Validate(verifySchema)
  async verifyEmail(@Body() body: IVerify, @Res() res: Response) {
    await this.authService.verify(body.email, body.token);
    const user = await User.findOne({ email: body.email }, { select: ['id', 'email'] });
    const refreshToken = this.jwtService.sign({ userId: user?.id }, { expiresIn: config.jwt.refreshTokenExpiration });
    const accessToken = this.jwtService.sign({ userId: user?.id }, { expiresIn: config.jwt.accessTokenExpiration });
    const expiresIn = config.jwt.accessTokenExpiration * 1_000;
    const refreshTokenExpiresIn = config.jwt.refreshTokenExpiration * 1_000;
    res.cookie('authentication', refreshToken, { httpOnly: true, expires: addDays(new Date(), 7) });
    return res.send({ refreshToken, accessToken, expiresIn, refreshTokenExpiresIn });
  }

  @Post('recover')
  @HttpCode(200)
  @Validate(recoverSchema)
  async recover(@Body() body: IRecover) {
    const user = await User.findOne({ email: body.email }, { select: ['id', 'email'] });
    if (user) this.emailService.sendRecoveryCode(user);
  }

  @Post('reset')
  @HttpCode(200)
  @Validate(resetPasswordSchema)
  async resetPassword(@Body() body: IResetPassword) {
    await this.authService.confirmResetPassword(body.email, body.token, body.newPassword);
  }

  @Get('token')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async token(@UserId() userId: string, @Res() res: Response) {
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: config.jwt.refreshTokenExpiration });
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: config.jwt.accessTokenExpiration });
    const expiresIn = config.jwt.accessTokenExpiration * 1_000;
    const refreshTokenExpiresIn = config.jwt.refreshTokenExpiration * 1_000;
    res.cookie('authentication', refreshToken, { httpOnly: true, expires: addDays(new Date(), 7) });
    return res.send({ refreshToken, accessToken, expiresIn, refreshTokenExpiresIn });
  }

  @Post('password')
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
