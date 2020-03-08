import { Controller, Post, Req, Res, HttpCode, Param, Get, UseGuards } from '@nestjs/common';
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
      token: this.jwtService.sign({ userId }),
    };
  }

  @Post('reset_password')
  async resetPassword(@Param() params: any) {
    const user = await User.findOne({ userId: params.userId });
    if (user) {
      this.emailService.sendVerificationCode(user);
    }
    return {};
  }

  @Post('verify_email')
  @HttpCode(200)
  verifyEmail(@Req() req: Request) {
    return this.authService.verify(req.body.email, req.body.token);
  }

  @Post('resend_email')
  resendEmail(@Req() req: Request, @Res() res: Response) {
    // TODO
  }

  @Post('new_password')
  newPassword(@Req() req: Request, @Res() res: Response) {
    // TODO
  }

  @UseGuards(AuthGuard())
  @Get('refresh_token')
  async refreshToken(@Req() req: Request) {
    return {
      token: this.jwtService.sign({ userId: (req.user as User).userId }),
    };
  }
}
