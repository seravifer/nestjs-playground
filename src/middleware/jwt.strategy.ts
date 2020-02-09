import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../models/user';
import { passwordSecret } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: passwordSecret,
    });
  }

  async validate(payload) {
    const user = await User.findOne({ userId: payload.user_id });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}