import {
    Body,
    Controller,
    UseGuards,
    Get,
    Post,
    Res,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';

import { CookieService } from '@/common/services/cookie.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UserReq } from '@/common/decorators/user.decorator'
import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private cookieService: CookieService,
        private usersService: UsersService
    ) { }

    @Post('register')
    register(@Body() body: CreateUserDto) {
        return this.authService.register(body)
    }

    @Post('login')
    async login(
        @Body() body: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const { access_token, user } = await this.authService.login(body);
        this.cookieService.setAuthCookie(res, access_token, body.remember);

        return user;
    }

    @Post('logout')
    logout(
        @Res({ passthrough: true }) res: Response
    ) {
        this.cookieService.clearAuthCookie(res);

        return { success: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@UserReq() user: JwtPayload) {
        const currentUser = await this.usersService.getUserProfileData(user.userId);
        if (!currentUser) {
            throw new UnauthorizedException('You are unauthorized!');
        }

        return currentUser;
    }

    @Post('reset-password')
    async sendPasswordResetEmail(@Body('email') email: string) {
        if (!email) throw new BadRequestException('Email is required');
        const isSent = await this.authService.sendPasswordResetEmail(email);
        if (!isSent) throw new BadRequestException('Unable to send reset email');
        return { message: 'Reset email sent successfully' };
    }

    @Post('reset-password/confirm')
    async resetPassword(
        @Body('token') token: string,
        @Body('password') password: string
    ) {
        const success = await this.authService.resetPassword(token, password);
        if (!success) throw new BadRequestException('Unable to reset password');
        return { message: 'Password updated successfully' };
    }


}
