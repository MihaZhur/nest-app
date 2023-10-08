import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@entities/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.getUserData(email);
    console.log(user);
    const salt = await genSalt(10);
    const passwordVerify = compare(password, salt);
    if (!user && !passwordVerify) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.userName };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      userName: user.userName,
      userSurname: user.userSurname,
    };
  }
}
