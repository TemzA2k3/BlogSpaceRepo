import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
    constructor(private readonly configService: ConfigService) { }

    private getCookieOptions() {
        const sameSite = this.configService.get<'lax' | 'strict' | 'none'>('JWT_COOKIE_SAME_SITE', 'lax');
        const secure = this.configService.get<string>('JWT_COOKIE_SECURE') === 'true';

        return {
            httpOnly: true,
            secure,
            sameSite,
            path: '/',
        };
    }

    setAuthCookie(res: Response, token: string, remember: boolean) {
        const cookieName = this.configService.get<string>('JWT_COOKIE_NAME', 'access_token');
        const defaultDays = this.configService.get<number>('JWT_COOKIE_MAX_AGE_DAYS', 7);

        const maxAge = remember ? 1000 * 60 * 60 * 24 * defaultDays : undefined;

        res.cookie(cookieName, token, {
            ...this.getCookieOptions(),
            maxAge,
        });
    }

    clearAuthCookie(res: Response) {
        const cookieName = this.configService.get<string>('JWT_COOKIE_NAME', 'access_token');

        res.clearCookie(cookieName, this.getCookieOptions());
    }
}