import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    register(@Body() body: CreateUserDto) {
        return this.authService.register(body)
    }

    @Post('/login')
    login(@Body() body: LoginUserDto) {
        return this.authService.login(body)
    }
}
