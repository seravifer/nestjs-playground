import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import moment from 'moment';

@Injectable()
export class AuthService {

  constructor() {}

  async register(data: any) {
    if (
      !data.firstName ||
      !data.lastName ||
      !data.birthdate ||
      !data.password ||
      !data.email
    ) {
      throw new BadRequestException('REQUIRED');
    }

    const isValidDate = moment(data.birthdate, 'DD/MM/YYYY').isValid();
    if (!isValidDate) throw new BadRequestException('INVALID_DATE');

    const exist = await User.findOne({ email: data.email });
    if (exist) throw new BadRequestException('USER_ALREADY_EXIST');

    data.password = bcrypt.hashSync(data.password, 8);

    const user = await User.save(data).catch(error => {
      Logger.warn('Register user on DB fail!');
      throw new BadRequestException();
    });

    return user;
  }

  async login(authData: { email: string; password: string }) {
    if (!authData.email || !authData.password) {
      throw new BadRequestException();
    }

    const user = await User.findOne({ email: authData.email });
    if (user && bcrypt.compareSync(authData.password, user.password)) {
      return user.userId;
    }

    throw new BadRequestException('AUTHENTICATION_FAIL');
  }

  async verify(userId: string, token: string) {
    if (!userId || !token) {
      throw new BadRequestException();
    }

    const user = await User.findOne({ userId });
    if (!user) throw new BadRequestException();

    if (user.activated) {
      throw new BadRequestException();
    }

    if (user.activationCode === token) {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ activated: true })
        .where('userId = :userId', { userId: user.userId })
        .execute();
      return true;
    }
  }
}
