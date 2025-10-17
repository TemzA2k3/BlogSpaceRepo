import { Controller, Get, UseGuards, Req } from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    getCurrentUser(@Req() req) {
        console.log(req.user);
        return this.userService.findByEmail(req.user.email)
    } 
}