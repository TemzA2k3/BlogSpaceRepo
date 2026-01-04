import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { BadRequestException, Logger } from '@nestjs/common';
import { extname, join } from 'path';

interface ImageUploadOptions {
    fieldName: string;
    folder: string;
    prefix?: string;
    maxSizeMB?: number;
}

const logger = new Logger('ImageUpload');

export const ImageUploadInterceptor = ({
    fieldName,
    folder,
    prefix = 'file',
    maxSizeMB = 5,
}: ImageUploadOptions) => {
    const uploadPath = join(process.cwd(), 'uploads', folder);

    logger.log(`Upload path: ${uploadPath}`);

    return FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: (req, file, cb) => {
                logger.log(`Destination path: ${uploadPath}`);
                logger.log(`Path exists: ${fs.existsSync(uploadPath)}`);

                if (!fs.existsSync(uploadPath)) {
                    logger.log(`Creating directory: ${uploadPath}`);
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = extname(file.originalname);
                const filename = `${prefix}-${uniqueSuffix}${ext}`;
                logger.log(`Saving file as: ${filename}`);
                cb(null, filename);
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