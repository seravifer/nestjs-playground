import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { config } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        return req.cookies['authentication'];
      }]),
      secretOrKey: config.jwt.secret,
      ignoreExpiration: false
    });
  }

  async validate(payload: { userId: string }) {
    return { userId: payload.userId };
  }
  
}
