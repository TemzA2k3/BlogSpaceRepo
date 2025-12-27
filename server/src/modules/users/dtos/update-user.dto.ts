import { IsString, IsBoolean, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { WhoCanMessage } from '@/database/entities/user.entity';

export class UpdateSettingsDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    userName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    location?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;

    @IsOptional()
    @IsBoolean()
    isPublicProfile?: boolean;

    @IsOptional()
    @IsEnum(WhoCanMessage)
    whoCanMessage?: WhoCanMessage;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    displayLanguage?: string;
}