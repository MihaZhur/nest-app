import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@entities/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt } from 'bcrypt';
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
    const salt = await genSalt(10);
    const passwordVerify = compare(password, salt);
    if (!user && !passwordVerify) {
      throw new UnauthorizedException();
    }
    console.log(user);
    const payload = { sub: user.id, userName: user.userName, role: user.role };
    console.log(payload);
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
        message: 'Ошибка',
      };
    }
  }
}
