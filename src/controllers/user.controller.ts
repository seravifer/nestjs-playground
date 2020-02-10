import { Controller, Req, Get, UseGuards, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  
  constructor() {}

  @Get('me')
  authenticate(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    delete user['password'];
    res.status(200).send(req.user);
  }
}
