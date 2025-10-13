import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // разрешаем фронт
    credentials: true,               // если используешь cookies
  });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // удаляет лишние поля
      forbidNonWhitelisted: true, // выбрасывает ошибку на лишние поля
      transform: true,      // автоматически конвертирует payload в DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
