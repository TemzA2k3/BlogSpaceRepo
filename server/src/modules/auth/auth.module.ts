import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from '../../common/services/password.service'
import { UsersModule } from '../../modules/users/users.module'

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => {
                const secret = config.get<string>('JWT_SECRET');
                const expiresIn = config.get<string>('JWT_EXPIRES_IN') ?? '3d';
        
                return {
                  secret,
                  signOptions: { expiresIn: expiresIn as any },
                };
            },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, PasswordService],
})
export class AuthModule { }
