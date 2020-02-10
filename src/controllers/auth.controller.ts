import { Controller, Post, Req, Res, HttpCode, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../services/email.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  @HttpCode(201)
  async create(@Req() req: Request) {
    const user = await this.authService.register(req.body);
    this.emailService.sendVerificationCode(user).catch(e => console.log(e));
    return {};
  }

  @Post('login')
  @HttpCode(200)
  async authenticate(@Req() req: Request) {
    const userId = await this.authService.login(req.body);
    return {
      userId: userId,
      token: this.jwtService.sign({ user_id: userId }),
    };
  }

  @Post('reset_password')
  resetPassword(@Req() req: Request, @Res() res: Response) {}

  @Post('verify_email')
  verifyEmail(@Param() params: any) {
    return this.authService.verify(params.userId, params.token);
  }

  @Post('resend_email')
  resendEmail(@Req() req: Request, @Res() res: Response) {}

  @Post('refresh_token')
  refreshToken(@Req() req: Request, @Res() res: Response) {}
}
