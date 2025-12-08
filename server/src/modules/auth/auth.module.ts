import { Module } from '@nestjs/common';

import { PasswordService } from '@/common/services/password.service';
import { CookieService } from '@/common/services/cookie.service';
import { JwtSharedModule } from '@/common/jwt/jwt.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UsersModule, JwtSharedModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, CookieService],
})
export class AuthModule {}
