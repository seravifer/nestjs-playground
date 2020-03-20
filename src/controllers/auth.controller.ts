import { Controller, Post, Req, HttpCode, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
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
  async create(@Req() req: Request) {
    const user = await this.authService.register(req.body);
    this.emailService.sendVerificationCode(user);
    return {};
  }

  @Post('login')
  @HttpCode(200)
  async authenticate(@Req() req: Request) {
    const userId = await this.authService.login(req.body);
    return {
      userId: userId,
      token: this.jwtService.sign({ userId })
    };
  }

  @Post('verify_email')
  @HttpCode(200)
  async verifyEmail(@Req() req: Request) {
    await this.authService.verify(req.body.email, req.body.token);
    return {};
  }

  @Post('resend_confirmation_email')
  @HttpCode(200)
  async resendConfirmationEmail(@Req() req: Request) {
    const user = await User.findOne({ email: req.body.email });
    if (user?.activated == true) throw new BadRequestException('ALREADY_ACTIVATED');
    if (user) this.emailService.sendVerificationCode(user);
    return {};
  }

  @Post('reset_password')
  @HttpCode(200)
  async newPassword(@Req() req: Request) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      this.emailService.sendRecoveryCode(user);
    }
    return {};
  }

  @Post('confirm_reset_password')
  @HttpCode(200)
  async chnageresetPassword(@Req() req: Request) {
    await this.authService.confirmResetPassword(req.body.email, req.body.token, req.body.new_password);
    return {};
  }

  @UseGuards(AuthGuard())
  @Get('refresh_token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request) {
    return {
      token: this.jwtService.sign({ userId: (req.user as User).userId })
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

    return {};
  }
}
