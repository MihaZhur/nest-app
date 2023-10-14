import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@entities/user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, code: string) {
    const url = `http://localhost/confirm?activate=${code}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome to Nice App! Confirm your Email',
        template: 'confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.userName,
          url,
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  async sendUserRefreshPassword(user: User, code: string) {
    const url = `http://localhost/refresh/${code}`;

    await this.mailerService
      .sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Refresh password',
        template: 'refresh-password', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.userName,
          url,
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}
