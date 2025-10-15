import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../database/entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtSharedModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtSharedModule
],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
