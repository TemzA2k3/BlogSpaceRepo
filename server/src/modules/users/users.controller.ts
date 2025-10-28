import { 
    Controller, 
    Get,
    Patch, 
    Param,
    UploadedFile, 
    UseInterceptors, 
    Req, 
    UseGuards
} from '@nestjs/common';
import { File as MulterFile } from 'multer';

import { UsersService } from './users.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AvatarUploadInterceptor } from '@/common/interceptors/avatar-upload.interceptor';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':id')
    getUserData(@Param('id') id: string) {
        return this.usersService.findOneByParams({ id: +id })
    }


    //TODO сделать дто и посмотреть почему не разлогинивает
    @Patch('avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(AvatarUploadInterceptor())
    changeAvatar(@UploadedFile() file: MulterFile, @Req() req) {
      return this.usersService.updateAvatar(req.user.id, file.filename);
    }
}