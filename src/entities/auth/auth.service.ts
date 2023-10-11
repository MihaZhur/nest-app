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
    console.log(code)
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
}
