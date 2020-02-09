import { Controller, Post, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('register')
  create(@Req() req: Request, @Res() res: Response) {
    this.authService.register(req.body).then(() => {
      res.status(201).send();
    }).catch(error => {
      Logger.warn(error, 'AuthController');
      res.status(400).send({ errorCode: error });
    });
  }

  @Post('login')
  authenticate(@Req() req: Request, @Res() res: Response) {
    this.authService.login(req.body)
      .then(result => {
        return res.status(200).send(result);
      }).catch(error => {
        return res.status(401).send({ errorCode: error });
      });
  }

}