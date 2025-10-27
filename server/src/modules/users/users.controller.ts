import { 
    Controller,
    Param,
    Get
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('/:id')
    getUserData(@Param('id') id: string) {
        return this.userService.findOneByParams({ id: +id })
    }
}