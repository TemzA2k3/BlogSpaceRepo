import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from '../../common/services/password.service';
import { CookieService } from '../../common/services/cookie.service';
import { UsersModule } from '../users/users.module';
import { JwtSharedModule } from '../../common/jwt/jwt.module';

@Module({
  imports: [UsersModule, JwtSharedModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, CookieService],
  exports: [AuthService],
})
export class AuthModule {}
