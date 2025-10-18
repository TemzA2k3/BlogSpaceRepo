export interface JwtPayload {
    userId: number;
    email: string;
    role: string;
    userName: string;
    iat?: number;
    exp?: number;
  }
  