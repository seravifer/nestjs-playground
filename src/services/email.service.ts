import { Injectable, Logger } from '@nestjs/common';
import { createTransport, SendMailOptions } from 'nodemailer';
import { User } from '../entities/user.entity';
import { config } from '../config';
import { v4 } from 'uuid';

@Injectable()
export class EmailService {

  sendMail(options: SendMailOptions) {
    const transporter = createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      logger: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      }
    });

    return transporter.sendMail({ ...options, from: config.smtp.mail });
  }

  async sendVerificationCode(user: User) {
    const emailToken = v4();
    Logger.log(`User token is: ${emailToken}`);
    // Save email token
    await User.update(user.id, { activationCode: emailToken });
    // Send email
    await this.sendMail({
      to: user.email,
      subject: 'Welcome!',
      text: `Your toke is: ${emailToken}`,
    }).catch(err => {
      Logger.error(`Unable to send mail: ${err}`);
    });
  }

  async sendRecoveryCode(user: User) {
    const emailToken = v4();
    Logger.log(`User token is: ${emailToken}`);
    // Save email token
    await User.update(user.id, { activationCode: emailToken });
    // Send email
    await this.sendMail({
      to: user.email,
      subject: 'Recovery!',
      text: `Your toke is: ${emailToken}`,
    }).catch(err => {
      Logger.error(`Unable to send mail: ${err}`);
    });
  }
}
