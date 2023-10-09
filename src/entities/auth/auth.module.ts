import { Module } from '@nestjs/common';
import { AuthService } from '@entities/auth/auth.service';
import { AuthController } from '@entities/auth/auth.controller';
import { UserModule } from '@entities/user/user.module';
import { MailModule } from '../../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MailModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.SEKRET_KEY_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
