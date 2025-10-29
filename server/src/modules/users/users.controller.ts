import { 
    Controller, 
    Get,
    Patch, 
    Param,
    UploadedFile, 
    UseInterceptors, 
    Req, 
    Query,
    UseGuards,
    Post,
    BadRequestException,
    Delete
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AvatarUploadInterceptor } from '@/common/interceptors/avatar-upload.interceptor';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':id')
    getUserData(
        @Param('id') id: string,
        @Query('currentUserId') currentUserId?: string
    ) {
        return this.usersService.getUserProfileData(+id, currentUserId ? +currentUserId : undefined);
    }

    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AvatarUploadInterceptor())
    changeAvatar(@UploadedFile() file: MulterFile, @Req() req) {
      return this.usersService.updateAvatar(req.user.id, file.filename);
    }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    followUser(@Param('id') targetId: number, @Req() req) {
        if (req.user.id === targetId) throw new BadRequestException('You cannot follow yourself!');

        return this.usersService.followUser(req.user.id, targetId);
    }

    @Delete(':id/unfollow')
    @UseGuards(JwtAuthGuard)
    unfollowUser(@Param('id') targetId: number, @Req() req) {
        const currentUserId = req.user.userId;
        return this.usersService.unfollowUser(+currentUserId, +targetId);
    }
}