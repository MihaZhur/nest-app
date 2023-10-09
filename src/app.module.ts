import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@db/typeorm.module';
import { AuthModule } from '@entities/auth/auth.module';
import { UserModule } from '@entities/user/user.module';
import { AuthController } from '@entities/auth/auth.controller';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule, TypeOrmModule, AuthModule, UserModule, MailModule],
  controllers: [AuthController],
})
export class AppModule {}
