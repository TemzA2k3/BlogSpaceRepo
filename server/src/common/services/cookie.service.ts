import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookie(res: Response, token: string) {
    const cookieName = this.configService.get<string>('JWT_COOKIE_NAME', 'access_token');
    const days = this.configService.get<number>('JWT_COOKIE_MAX_AGE_DAYS', 3);
    const maxAge = 1000 * 60 * 60 * 24 * days;

    const sameSite = this.configService.get<'lax' | 'strict' | 'none'>('JWT_COOKIE_SAME_SITE', 'lax');
    const secure = this.configService.get<string>('JWT_COOKIE_SECURE') === 'true';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure, // HTTPS только если true
      sameSite,
      maxAge,
    });
  }

  clearAuthCookie(res: Response) {
    const cookieName = this.configService.get<string>('JWT_COOKIE_NAME', 'access_token');
    res.clearCookie(cookieName);
  }
}
