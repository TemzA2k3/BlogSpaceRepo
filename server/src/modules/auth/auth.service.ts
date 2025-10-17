import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from '@/common/services/password.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hash(createUserDto.password);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const { password, ...safeUser } = newUser;

    return safeUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if(!user) {
        throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.compare(
        loginUserDto.password,
        user.password,
    );

    if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
    }

    if (user.isBlocked) {
        throw new BadRequestException('User is blocked');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const { password, ...safeUser } = user;

    return {
        access_token: this.jwtService.sign(payload),
        user: safeUser,
    };
  }
}
