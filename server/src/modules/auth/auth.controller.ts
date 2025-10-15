import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { CookieService } from '../../common/services/cookie.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private cookieService: CookieService
    ) {}

    @Post('register')
    register(@Body() body: CreateUserDto) {
        return this.authService.register(body)
    }

    @Post('login')
    async login(@Body() body: LoginUserDto, @Res({ passthrough: true }) res: Response) {
      const { access_token, user } = await this.authService.login(body);
      this.cookieService.setAuthCookie(res, access_token);
      return { user };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        this.cookieService.clearAuthCookie(res);

        return { message: 'Logged out' };
    }
}
