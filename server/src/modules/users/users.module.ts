import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/database/entities/user.entity';
import { UserRelation } from '@/database/entities/user-relation.entity';

import { JwtSharedModule } from '@/common/jwt/jwt.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRelation]),
    JwtSharedModule
],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
