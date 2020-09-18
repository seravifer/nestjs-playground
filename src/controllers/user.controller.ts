import { Controller, Req, Get, UseGuards, HttpCode, Put, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {

  @Get()
  @HttpCode(200)
  async getUser(@Req() req: Request) {
    return User.findOne(req.user.userId,
      { select: ['id', 'firstName', 'lastName', 'email', 'birthdate', 'prefixPhone', 'phone'] });
  }

  @Put()
  @HttpCode(200)
  async updateUser(@Req() req: Request) {    
    // TODO: validate with class-validator
    const user = User.findOne(req.user.userId, { select: ['id']});
    if (!user) return new BadRequestException('USER_NOT_FOUND');
    await User.update(req.user.userId, req.body);
  }

}
