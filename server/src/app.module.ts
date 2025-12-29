import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { ChatModule } from './modules/chat/chat.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ContactModule } from './modules/contact/contact.module';

import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    ArticlesModule,
    ChatModule,
    CommentsModule,
    ContactModule,
  ],
  providers: [],
  controllers: [HealthController],
})
export class AppModule {}
