import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@entities/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from '@entities/user/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.getUserData(email);

    const passwordVerify = await compare(password, user.password);

    if (!user || !passwordVerify) {
      throw new UnauthorizedException('Неверный пароль или емайл');
    }

    const payload = { sub: user.id, userName: user.userName, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      userName: user.userName,
      userSurname: user.userSurname,
    };
  }

  async signUp(user: any) {
    try {
      const userData: User = await this.userService.createUser(user);
      if (userData) {
        const code = userData.emailConformitionToken;
        await this.mailService.sendUserConfirmation(userData, code);
        return {
          message:
            'Регистрация прошла успешно! Вам на почту отправлено письмо для подтверждения',
        };
      }
      throw new BadRequestException('Ошибка');
    } catch (err) {
      return {
        message: 'Неизвестная ошибка',
      };
    }
  }
  async activate(code: string) {
    try {
      const user = await this.userService.findOneCodeActivate(code);
      if (user) {
        console.log(user);
        user.userActive = true;
        user.emailConformitionToken = null;
        await this.userService.updateUserData(user.id, user);
        return {
          message: 'Ваш аккаунт успешно активирован!',
        };
      }
      throw new BadRequestException('Ошибка');
    } catch (err) {
      return {
        message: 'Неизвестная ошибка',
      };
    }
  }

  async resetPassword(body: any) {
    const user = await this.userService.getUserData(body.email);
    if (user && !user.refreshPassword) {
      await this.userService.resetPassword(user);

      await this.mailService.sendUserRefreshPassword(
        user,
        user.refreshPassword,
      );

      return {
        message: 'Вам на почту отправлено письмо для смены пароля!',
      };
    }
    return {
      message: 'Мы Уже отправляли Вам письмо о смене пароля',
    };
  }

  async changePassword(body: any) {
    try {
      const user = await this.userService.getUserDataRefreshPassword(
        body.refreshPassword,
      );
      console.log(body);

      if (user && user.refreshPassword) {
        user.password = body.password;
        await this.userService.changePassword(user);
        return {
          message: 'Пароль успешно изменен!',
        };
      }
      throw new BadRequestException('Ошибка, обновления пароля');
    } catch (err) {
      throw new BadRequestException(err ? err.message : 'Неизвестная ошибка');
    }
  }
}
