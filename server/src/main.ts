import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Глобальный префикс для API
    app.setGlobalPrefix('api');

    // Статические файлы (uploads)
    // В Docker: /app/uploads, локально: ../uploads от dist
    const uploadsPath =
        process.env.NODE_ENV === 'production'
            ? join(process.cwd(), 'uploads')
            : join(__dirname, '..', 'uploads');

    app.useStaticAssets(uploadsPath, {
        prefix: '/uploads/',
    });

    app.use(cookieParser());

    // CORS — берём из переменных окружения
    const clientUrl = configService.get<string>('CLIENT_URL');
    app.enableCors({
        origin: clientUrl || 'http://localhost:3000',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const port = configService.get<number>('PORT') || 8080;
    await app.listen(port);

    logger.log(`Application running on port ${port}`);
    logger.log(`CORS enabled for: ${clientUrl || 'http://localhost:3000'}`);
    logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();