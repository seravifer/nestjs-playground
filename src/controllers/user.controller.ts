import { Controller, Req, Get, UseGuards, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {

  @Get('me')
  @HttpCode(200)
  authenticate(@Req() req: Request) {
    const user = req.user as User;
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthdate: user.birthdate,
      prefixPhone: user.prefixPhone,
      phone: user.phone
    };
  }
}
