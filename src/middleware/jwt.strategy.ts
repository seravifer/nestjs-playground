import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../entities/user';
import { config } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
      ignoreExpiration: false
    });
  }

  async validate(payload: any) {
    const user = await User.findOne(payload.userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }
  
}
