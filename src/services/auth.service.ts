import { Injectable, Logger } from '@nestjs/common';
import { User } from '../models/user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService
  ) {}

  async register(user: any) {
    if(!user.firstName || !user.lastName || !user.birthdate || !user.password || !user.email) {
      return Promise.reject('REQUIRED');
    }

    const isValidDate = moment(user.birthdate, 'DD/MM/YYYY').isValid();
    if (!isValidDate) return Promise.reject('INVALID_DATE');

    const exist = await User.findOne({ email: user.email });
    if (exist) return Promise.reject('USER_ALREADY_EXIST');

    user.password = bcrypt.hashSync(user.password, 8);

    return await User.save<User>(user).catch(error => {
      Logger.warn('Register user on DB fail!');
      return Promise.reject('BAD_REQUEST');
    });
  }

  async login(authData: { email: string, password: string }) {
    if (!authData.email || !authData.password) {
      return Promise.reject('BAD_REQUEST');
    }

    const user = await User.findOne({ email: authData.email });
    if (user && bcrypt.compareSync(authData.password, user.password)) {
      return {
        userId: user.userId,
        jwt: this.jwtService.sign({ user_id: user.userId })
      };
    } else {
      return Promise.reject('AUTHENTICATION_FAIL');
    }
  }
  
}