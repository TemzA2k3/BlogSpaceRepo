import { 
    Controller, 
    Get,
    Patch, 
    Param,
    UploadedFile, 
    UseInterceptors, 
    Query,
    UseGuards,
    Post,
    BadRequestException,
    Delete,
    HttpCode
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { UsersService } from './users.service';

import { type JwtPayload } from '@/shared/types/jwt-payload.interface';

import { UserReq } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ImageUploadInterceptor } from '@/common/interceptors/image-upload.interceptor';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':id')
    getUserProfileData(
        @Param('id') id: string,
        @Query('currentUserId') currentUserId?: string
    ) {
        return this.usersService.getUserProfileData(+id, currentUserId ? +currentUserId : undefined);
    }

    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ImageUploadInterceptor({
        fieldName: 'avatar',
        folder: 'avatars',
        prefix: 'avatar',
        maxSizeMB: 2,
      }))
    changeAvatar(
        @UploadedFile() file: MulterFile, 
        @UserReq() user: JwtPayload
    ) {        
      return this.usersService.updateAvatar(user.userId, file.filename);
    }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    async followUser(
        @Param('id') targetId: number, 
        @UserReq() user: JwtPayload
    ) {
        if (user.userId === targetId) throw new BadRequestException('You cannot follow yourself!');
        await this.usersService.followUser(user.userId, targetId);
    }

    @Delete(':id/unfollow')
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    async unfollowUser(
        @Param('id') targetId: number, 
        @UserReq() user: JwtPayload
    ) {
        const currentUserId = user.userId;
        await this.usersService.unfollowUser(+currentUserId, +targetId);
    }
}