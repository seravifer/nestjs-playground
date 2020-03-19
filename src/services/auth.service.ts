import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';
import moment from 'moment';

@Injectable()
export class AuthService {

  async register(data: any) {
    if (!data.firstName || !data.lastName || !data.birthdate || !data.password || !data.email) {
      throw new BadRequestException('REQUIRED');
    }

    const isValidDate = moment(data.birthdate, 'DD/MM/YYYY').isValid();
    if (!isValidDate) throw new BadRequestException('INVALID_DATE');

    const exist = await User.findOne({ email: data.email });
    if (exist) throw new BadRequestException('USER_ALREADY_EXIST');

    data.password = bcrypt.hashSync(data.password, 8);

    const user = await User.save(data).catch(() => {
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

  async changePassword(oldPassword: string, newPassword: string, user: User) {
    if (oldPassword == newPassword) {
      throw new BadRequestException('SAME_PASSWORD');
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new BadRequestException('INVALID_PASSWORD');
    }

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: bcrypt.hashSync(newPassword, 8) })
      .where('userId = :userId', { userId: user.userId })
      .execute();

    return {}
  }

  async verify(email: string, token: string) {
    if (!email || !token) {
      throw new BadRequestException();
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestException();
    }

    if (user.activated) {
      throw new BadRequestException('ALREADY_ACTIVATED');
    }

    if (user.activationCode !== token) {
      throw new BadRequestException();
    }

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ activated: true, activationCode: null })
      .where('userId = :userId', { userId: user.userId })
      .execute();
  }

}
