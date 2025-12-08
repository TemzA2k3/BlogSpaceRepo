import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PasswordService } from '@/common/services/password.service';
import { EmailService } from '../email/email.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) { }

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

        if (!user) {
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

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            userName: user.userName
        };

        const { password, ...safeUser } = user;

        return {
            access_token: this.jwtService.sign(payload),
            user: safeUser,
        };
    }

    async sendPasswordResetEmail(email: string): Promise<boolean> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return true;
        }

        const token = this.jwtService.sign(
            { userId: user.id },
            { expiresIn: '1h' } 
        );

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        const html = `
            <p>Чтобы сбросить пароль, перейдите по ссылке:</p>
            <a href="${resetLink}">Сбросить пароль</a>
            <p>Ссылка действительна 1 час.</p>
        `;

        await this.emailService.sendMail(user.email, 'Сброс пароля', html);

        return true;
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = this.jwtService.verify<{ userId: number }>(token);
            const hashedPassword = await this.passwordService.hash(newPassword);
            await this.usersService.updatePassword(payload.userId, hashedPassword);
            return true;
        } catch (err) {
            throw new BadRequestException('Invalid or expired token');
        }
    }
}
