import { ISignup } from './../controllers/auth/auth.model';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  async register(data: ISignup) {
    const exist = await User.findOne({ email: data.email }, { select: ['id'] });
    if (exist) throw new BadRequestException('USER_ALREADY_EXIST');

    data.password = bcrypt.hashSync(data.password, 8);

    return await User.save(data as any).catch(err => {
      Logger.error('Register user on DB fail!', err);
      throw new BadRequestException();
    });
  }

  async login(authData: { email: string; password: string }) {
    const user = await User.findOne({ email: authData.email });
    if (user && bcrypt.compareSync(authData.password, user.password)) {
      return user.id;
    }

    throw new BadRequestException('AUTHENTICATION_FAIL');
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findOne(userId, { select: ['id', 'password'] });

    if (!user) {
      throw new BadRequestException();
    }

    if (oldPassword == newPassword) {
      throw new BadRequestException('SAME_PASSWORD');
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new BadRequestException('INVALID_PASSWORD');
    }

    await User.update(user.id, { password: bcrypt.hashSync(newPassword, 8) });
  }

  async confirmResetPassword(email: string, token: string, newPassword: string) {
    const user = await User.findOne({ email }, { select: ['id', 'activated', 'activationCode'] });
    if (!user) {
      throw new BadRequestException();
    }

    if (user.activationCode !== token) {
      throw new BadRequestException('INVALID_TOKEN');
    }

    await User.update(user.id, { activationCode: undefined, password: bcrypt.hashSync(newPassword, 8) });
  }

  async verify(email: string, token: string) {
    const user = await User.findOne({ email }, { select: ['id', 'activated', 'activationCode'] });
    if (!user) {
      throw new BadRequestException();
    }

    if (user.activated) {
      throw new BadRequestException('ALREADY_ACTIVATED');
    }

    if (user.activationCode !== token) {
      throw new BadRequestException();
    }

    await User.update(user.id, { activated: true, activationCode: undefined });
  }

}
