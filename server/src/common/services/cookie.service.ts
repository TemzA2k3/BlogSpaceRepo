import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setAuthCookie(res: Response, token: string, remember: boolean) {
    const cookieName = this.configService.get<string>('JWT_COOKIE_NAME', 'access_token');
    const defaultDays = this.configService.get<number>('JWT_COOKIE_MAX_AGE_DAYS', 3);

    // Если remember = true → долгоживущая cookie, иначе сессионная
    const maxAge = remember ? 1000 * 60 * 60 * 24 * defaultDays : undefined;

    const sameSite = this.configService.get<'lax' | 'strict' | 'none'>('JWT_COOKIE_SAME_SITE', 'lax');
    const secure = this.configService.get<string>('JWT_COOKIE_SECURE') === 'true';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure,
      sameSite,
      maxAge,
    });
  }

  clearAuthCookie(res: Response) {
    const cookieName = this.configService.get<string>('JWT_COOKIE_NAME', 'access_token');
    res.clearCookie(cookieName);
  }
}
