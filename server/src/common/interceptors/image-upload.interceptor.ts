import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';
import { extname, join } from 'path';

interface ImageUploadOptions {
  fieldName: string; // имя поля в form-data
  folder: string; // название подпапки (например: 'avatars', 'posts')
  prefix?: string; // префикс имени файла
  maxSizeMB?: number; // максимальный размер файла
}

/**
 * Универсальный интерсептор для загрузки изображений
 * Пример использования: @UseInterceptors(ImageUploadInterceptor({ fieldName: 'avatar', folder: 'avatars' }))
 */
export const ImageUploadInterceptor = ({
  fieldName,
  folder,
  prefix = 'file',
  maxSizeMB = 5,
}: ImageUploadOptions) => {
  const uploadPath = join(process.cwd(), 'uploads', folder);

  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = extname(file.originalname);
        cb(null, `${prefix}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};
