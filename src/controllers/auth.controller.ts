import { Controller, Post, Req, HttpCode, Get, UseGuards, BadRequestException, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../services/email.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user';

@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
  ) { }

  @Post('register')
  @HttpCode(201)
  async register(@Req() req: Request) {
    const user = await this.authService.register(req.body);
    this.emailService.sendVerificationCode(user);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request, @Res() res: Response) {
    const userId = await this.authService.login(req.body);
    const token = this.jwtService.sign({ userId });
    res.cookie('authentication', token, { httpOnly: true })

    return res.send({ userId, token });
  }
  
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('authentication')
    return res.send();
  }

  @Post('verify_email')
  @HttpCode(200)
  async verifyEmail(@Req() req: Request) {
    await this.authService.verify(req.body.email, req.body.token);
  }

  @Post('resend_confirmation_email')
  @HttpCode(200)
  async resendConfirmationEmail(@Req() req: Request) {
    const user = await User.findOne({ email: req.body.email }, { select: ['id', 'activated', 'email'] });
    if (user?.activated == true) throw new BadRequestException('ALREADY_ACTIVATED');
    if (user) this.emailService.sendVerificationCode(user);
  }

  @Post('reset_password')
  @HttpCode(200)
  async newPassword(@Req() req: Request) {
    const user = await User.findOne({ email: req.body.email }, { select: ['id', 'email'] });
    if (user) this.emailService.sendRecoveryCode(user);
  }

  @Post('confirm_reset_password')
  @HttpCode(200)
  async chnageresetPassword(@Req() req: Request) {
    await this.authService.confirmResetPassword(req.body.email, req.body.token, req.body.new_password);
  }

  @UseGuards(AuthGuard())
  @Get('refresh_token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request) {
    return {
      token: this.jwtService.sign({ userId: (req.user as User).id })
    };
  }

  @UseGuards(AuthGuard())
  @Get('change_password')
  @HttpCode(200)
  async changePassword(@Req() req: Request) {
    await this.authService.changePassword(
      req.body.old_password,
      req.body.new_password,
      req.user as User
    );
  }
}
